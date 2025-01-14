const { TagSetC, AttrSetC } = require("../../model/IASBModel/IASB_setC_model");
const getAllFiles = require("../../utils/getAllFiles");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const SaxonJS = require("saxon-js");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3600 }); // Cache with 1-hour expiration
const zipFilePath = path.join(__dirname, "../../../output/IASB/IASB_SetC");

const getOrCreateSEF = (key, xslPath, sefPath) => {
    const cachedPath = cache.get(key);
    if (cachedPath) return cachedPath;

    // Create SEF file if not exists
    if (!fs.existsSync(sefPath)) {
        execSync(`xslt3 -t -xsl:${xslPath} -export:${sefPath} -nogo`);
    }
    cache.set(key, sefPath);
    return sefPath;
};

const extractUniqueElements = async (ditaFiles, tagSefPath, attrSefPath) => {
    const uniqueTags = new Set();
    const uniqueAttr = new Set();

    await Promise.all(
        ditaFiles.map(async (ditaInput) => {
            const abso = path.resolve(ditaInput);

            // Extract tags
            const cachedTags = cache.get(`tags-${abso}`);
            if (cachedTags) {
                cachedTags.forEach((tag) => uniqueTags.add(tag));
            } else {
                const tagResult = SaxonJS.transform({
                    stylesheetFileName: tagSefPath,
                    sourceFileName: abso,
                    destination: "serialized",
                }).principalResult;

                const tags = tagResult.match(/<\/?[^>]+>/g) || [];
                cache.set(`tags-${abso}`, tags);
                tags.forEach((tag) => uniqueTags.add(tag));
            }

            // Extract attributes
            const cachedAttrs = cache.get(`attrs-${abso}`);
            if (cachedAttrs) {
                cachedAttrs.forEach((attr) => uniqueAttr.add(attr));
            } else {
                const attrResult = SaxonJS.transform({
                    stylesheetFileName: attrSefPath,
                    sourceFileName: abso,
                    destination: "serialized",
                }).principalResult;

                const attributes = attrResult.match(/<\/?[^>]+>/g) || [];
                cache.set(`attrs-${abso}`, attributes);
                attributes.forEach((attr) => uniqueAttr.add(attr));
            }
        })
    );

    return { uniqueTags, uniqueAttr };
};

const IASB_setC_controller = async (req, res) => {
    try {
        const allFiles = getAllFiles(zipFilePath);
        const ditaFiles = allFiles.filter((file) => file.endsWith(".xml") || file.endsWith(".dita"));

        // Get or create SEF paths with caching
        const tagSefPath = getOrCreateSEF(
            "tag-sef",
            path.resolve(__dirname, "../../../public/XSLT_Files/extract_elements.xsl"),
            path.resolve(__dirname, "../../../testJsonFiles/IASB_SetC_tag.sef.json")
        );

        const attrSefPath = getOrCreateSEF(
            "attr-sef",
            path.resolve(__dirname, "../../../public/XSLT_Files/extract_attributes.xsl"),
            path.resolve(__dirname, "../../../testJsonFiles/IASB_SetC_attr.sef.json")
        );

        // Extract unique tags and attributes
        const { uniqueTags, uniqueAttr } = await extractUniqueElements(ditaFiles, tagSefPath, attrSefPath);

        // Insert unique tags into the database
        const tagsArray = Array.from(uniqueTags).map((name) => ({ name }));
        await Promise.all(
            tagsArray.map(async (tag) => {
                await TagSetC.findOrCreate({ where: { name: tag.name }, defaults: tag });
            })
        );

        // Insert unique attributes into the database
        const attributesArray = Array.from(uniqueAttr).map((name) => ({ name }));
        await Promise.all(
            attributesArray.map(async (attr) => {
                await AttrSetC.findOrCreate({ where: { name: attr.name }, defaults: attr });
            })
        );

        return res.status(200).json({ statusCode: "200", status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
};

module.exports = IASB_setC_controller;
