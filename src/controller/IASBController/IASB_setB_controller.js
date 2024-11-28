const { TagSetB, AttrSetB } = require("../../model/IASBModel/IASB_setB_model");
const getAllFiles = require("../../utils/getAllFiles");
const path = require('path');
const { execSync } = require("child_process"); 
const SaxonJS = require('saxon-js');
const zipFilePath = path.join(__dirname, '../../../output/IASB/IASB_SetB');

const IASB_setB_controller = async (req, res) => {
    try {
        const allFiles = getAllFiles(zipFilePath);
        const ditaFiles = allFiles.filter(file => file.endsWith('.xml') || file.endsWith('.dita'));

        const tagJsonPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetB_tag.sef.json');
        const attrJsonPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetB_attr.sef.json');

        // Ensure the directories exist
        const fs = require('fs');
        const testJsonDir = path.dirname(tagJsonPath);
        if (!fs.existsSync(testJsonDir)) {
            fs.mkdirSync(testJsonDir, { recursive: true });
        }

        // Generate JSON files
        execSync(
            `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_elements.xsl')} -export:${tagJsonPath} -nogo`
        );
        execSync(
            `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_attributes.xsl')} -export:${attrJsonPath} -nogo`
        );

        if (!fs.existsSync(tagJsonPath) || !fs.existsSync(attrJsonPath)) {
            throw new Error(`XSLT transformation failed to create required JSON files.`);
        }

        const uniqueTags = new Set();
        const uniqueAttr = new Set();

        for (const ditaInput of ditaFiles) {
            const abso = path.resolve(ditaInput);

            const tagResult = SaxonJS.transform({
                stylesheetFileName: tagJsonPath,
                sourceFileName: abso,
                destination: 'serialized',
            }).principalResult;

            const cleanedTagResult = tagResult.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
            const tags = cleanedTagResult.match(/<\/?[^>]+>/g);
            if (tags) {
                tags.forEach(tag => uniqueTags.add(tag));
            }

            const attrResult = SaxonJS.transform({
                stylesheetFileName: attrJsonPath,
                sourceFileName: abso,
                destination: 'serialized',
            }).principalResult;

            const cleanedAttrResult = attrResult.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
            const attributes = cleanedAttrResult.match(/<\/?[^>]+>/g);
            if (attributes) {
                attributes.forEach(attr => uniqueAttr.add(attr));
            }
        }

        const uniqueTagsArray = Array.from(uniqueTags).map(tag => ({ name: tag }));
        const uniqueAttrArray = Array.from(uniqueAttr).map(attr => ({ name: attr }));

        const tagBulkOps = uniqueTagsArray.map(tag => ({
            updateOne: {
                filter: { name: tag.name },
                update: { $setOnInsert: tag },
                upsert: true
            }
        }));
        await TagSetB.bulkWrite(tagBulkOps);

        const attrBulkOps = uniqueAttrArray.map(attr => ({
            updateOne: {
                filter: { name: attr.name },
                update: { $setOnInsert: attr },
                upsert: true
            }
        }));
        await AttrSetB.bulkWrite(attrBulkOps);

        return res.status(200).json({ statusCode: "200", status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "fail", message: 'Internal Server Error' });
    }
};

module.exports = IASB_setB_controller;
