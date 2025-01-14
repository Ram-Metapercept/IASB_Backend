const { TagSetA, AttrSetA } = require("../../model/IASBModel/IASB_setA_model"); // Sequelize models
const getAllFiles = require("../../utils/getAllFiles");
const path = require('path');
const { execSync } = require("child_process");
const SaxonJS = require('saxon-js');
const fs = require('fs');
const zipFilePath = path.join(__dirname, '../../../output/IASB/IASB_SetA');

// In-memory cache for storing XSLT transformation results
const xsltCache = {
    tag: {},
    attr: {}
};

const IASB_setA_controller = async (req, res) => {
    try {
        const allFiles = getAllFiles(zipFilePath);
        const ditaFiles = allFiles.filter(file => file.endsWith('.xml') || file.endsWith('.dita'));

        const tagJsonPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetA_tag.sef.json');
        const attrJsonPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetA_attr.sef.json');
        const testJsonDir = path.dirname(tagJsonPath);

        // Create testJsonDir if it doesn't exist
        if (!fs.existsSync(testJsonDir)) {
            fs.mkdirSync(testJsonDir, { recursive: true });
        }

        // Only perform XSLT transformation if the JSON files are not cached
        const cacheTagJson = fs.existsSync(tagJsonPath);
        const cacheAttrJson = fs.existsSync(attrJsonPath);

        if (!cacheTagJson || !cacheAttrJson) {
            execSync(
                `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_elements.xsl')} -export:${tagJsonPath} -nogo`
            );
            execSync(
                `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_attributes.xsl')} -export:${attrJsonPath} -nogo`
            );
        }

        if (!fs.existsSync(tagJsonPath) || !fs.existsSync(attrJsonPath)) {
            throw new Error(`XSLT transformation failed to create required JSON files.`);
        }

        // Sets for unique tags and attributes
        const uniqueTags = new Set();
        const uniqueAttr = new Set();

        // Process each DITA file
        for (const ditaInput of ditaFiles) {
            const abso = path.resolve(ditaInput);

            // Cache and reuse the XSLT transformation results for tags
            let tagResult;
            if (xsltCache.tag[abso]) {
                tagResult = xsltCache.tag[abso];  // Use cached result
            } else {
                tagResult = SaxonJS.transform({
                    stylesheetFileName: tagJsonPath,
                    sourceFileName: abso,
                    destination: 'serialized',
                }).principalResult;
                xsltCache.tag[abso] = tagResult; // Cache the result
            }

            const cleanedTagResult = tagResult.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
            const tags = cleanedTagResult.match(/<\/?[^>]+>/g);
            if (tags) {
                tags.forEach(tag => uniqueTags.add(tag));
            }

            // Cache and reuse the XSLT transformation results for attributes
            let attrResult;
            if (xsltCache.attr[abso]) {
                attrResult = xsltCache.attr[abso];  // Use cached result
            } else {
                attrResult = SaxonJS.transform({
                    stylesheetFileName: attrJsonPath,
                    sourceFileName: abso,
                    destination: 'serialized',
                }).principalResult;
                xsltCache.attr[abso] = attrResult; // Cache the result
            }

            const cleanedAttrResult = attrResult.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
            const attributes = cleanedAttrResult.match(/<\/?[^>]+>/g);
            if (attributes) {
                attributes.forEach(attr => uniqueAttr.add(attr));
            }
        }

        // Prepare the unique tags and attributes for bulk operations
        const uniqueTagsArray = Array.from(uniqueTags).map(tag => ({ name: tag }));
        const uniqueAttrArray = Array.from(uniqueAttr).map(attr => ({ name: attr }));

        // Bulk insert for unique tags using Sequelize
        await TagSetA.bulkCreate(uniqueTagsArray, {
            ignoreDuplicates: true, // Avoid duplicate entries
        });

        // Bulk insert for unique attributes using Sequelize
        await AttrSetA.bulkCreate(uniqueAttrArray, {
            ignoreDuplicates: true, // Avoid duplicate entries
        });

        return res.status(200).json({ statusCode: "200", status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "fail", message: 'Internal Server Error' });
    }
};

module.exports = IASB_setA_controller;

