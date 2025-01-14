const { TagSetB, AttrSetB } = require("../../model/IASBModel/IASB_setB_model");
const getAllFiles = require("../../utils/getAllFiles");
const path = require("path");
const { execSync } = require("child_process");
const SaxonJS = require("saxon-js");
const fs = require("fs");

const zipFilePath = path.join(__dirname, "../../../output/IASB/IASB_SetB");
const xsltFiles = {
    tag: path.resolve(__dirname, "../../../public/XSLT_Files/extract_elements.xsl"),
    attr: path.resolve(__dirname, "../../../public/XSLT_Files/extract_attributes.xsl"),
};
const cachePaths = {
    tag: path.resolve(__dirname, "../../../testJsonFiles/IASB_SetB_tag.sef.json"),
    attr: path.resolve(__dirname, "../../../testJsonFiles/IASB_SetB_attr.sef.json"),
};

// In-memory cache for XSLT results
const xsltCache = {
    tag: {},
    attr: {},
};

// Ensure the directory for cached JSON files exists
const ensureCacheDirectory = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Perform XSLT transformations and export as JSON
const exportXSLTJson = () => {
    Object.entries(xsltFiles).forEach(([key, xsltFilePath]) => {
        if (!fs.existsSync(cachePaths[key])) {
            execSync(
                `xslt3 -t -xsl:${xsltFilePath} -export:${cachePaths[key]} -nogo`,
                { stdio: "inherit" }
            );
        }
    });
    if (!fs.existsSync(cachePaths.tag) || !fs.existsSync(cachePaths.attr)) {
        throw new Error("XSLT transformation failed to generate required JSON files.");
    }
};

// Process a single file using SaxonJS
const processFileWithSaxonJS = (filePath, xsltJsonPath, cache) => {
    if (cache[filePath]) {
        return cache[filePath];
    }
    const result = SaxonJS.transform({
        stylesheetFileName: xsltJsonPath,
        sourceFileName: filePath,
        destination: "serialized",
    }).principalResult;

    cache[filePath] = result;
    return result;
};

// Extract tags or attributes from SaxonJS results
const extractElements = (result, regex) => {
    const cleanedResult = result.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, "");
    const matches = cleanedResult.match(regex);
    return matches ? [...new Set(matches)] : [];
};

// Insert unique data into the database using Sequelize
const insertUniqueData = async (model, data) => {
    await Promise.all(
        data.map(async (item) => {
            await model.findOrCreate({
                where: { name: item.name },
                defaults: item,
            });
        })
    );
};

// Main controller function
const IASB_setB_controller = async (req, res) => {
    try {
        ensureCacheDirectory(cachePaths.tag);
        ensureCacheDirectory(cachePaths.attr);

        // Perform XSLT export if JSON files are not already available
        exportXSLTJson();

        // Collect all files
        const allFiles = getAllFiles(zipFilePath);
        const ditaFiles = allFiles.filter((file) =>
            file.endsWith(".xml") || file.endsWith(".dita")
        );

        const uniqueTags = new Set();
        const uniqueAttr = new Set();

        // Process files concurrently
        await Promise.all(
            ditaFiles.map(async (ditaFile) => {
                const absolutePath = path.resolve(ditaFile);

                // Process tags
                const tagResult = processFileWithSaxonJS(absolutePath, cachePaths.tag, xsltCache.tag);
                const tags = extractElements(tagResult, /<\/?[^>]+>/g);
                tags.forEach((tag) => uniqueTags.add(tag));

                // Process attributes
                const attrResult = processFileWithSaxonJS(absolutePath, cachePaths.attr, xsltCache.attr);
                const attributes = extractElements(attrResult, /<\/?[^>]+>/g);
                attributes.forEach((attr) => uniqueAttr.add(attr));
            })
        );

        // Prepare data for database insertion
        const tagsArray = Array.from(uniqueTags).map((name) => ({ name }));
        const attributesArray = Array.from(uniqueAttr).map((name) => ({ name }));

        // Insert into database
        await insertUniqueData(TagSetB, tagsArray);
        await insertUniqueData(AttrSetB, attributesArray);

        return res.status(200).json({ statusCode: "200", status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
};

module.exports = IASB_setB_controller;
