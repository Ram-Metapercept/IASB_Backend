const { TagSetC, AttrSetC } = require("../../model/IASBModel/IASB_setC_model");
const getAllFiles = require("../../utils/getAllFiles");
const path = require('path');
const fs = require('fs');
const { execSync } = require("child_process"); 
const SaxonJS = require('saxon-js');
const zipFilePath = path.join(__dirname, '../../../output/IASB/IASB_SetC');

const IASB_setC_controller = async (req, res) => {
    try {
        const allFiles = getAllFiles(zipFilePath);
        const ditaFiles = allFiles.filter(file => file.endsWith('.xml') || file.endsWith('.dita'));

        const tagSefPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetC_tag.sef.json');
        const attrSefPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetC_attr.sef.json');

    
        const testJsonDir = path.dirname(tagSefPath);
        if (!fs.existsSync(testJsonDir)) {
            fs.mkdirSync(testJsonDir, { recursive: true });
        }

        execSync(
            `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_elements.xsl')} -export:${tagSefPath} -nogo`
        );
        execSync(
            `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_attributes.xsl')} -export:${attrSefPath} -nogo`
        );
        if (!fs.existsSync(tagSefPath) || !fs.existsSync(attrSefPath)) {
            throw new Error(`XSLT transformation failed to create required JSON files.`);
        }

        const uniqueTags = new Set();
        const uniqueAttr = new Set();

        for (const ditaInput of ditaFiles) {
            const abso = path.resolve(ditaInput);

            const tagResult = SaxonJS.transform({
                stylesheetFileName: tagSefPath,
                sourceFileName: abso,
                destination: 'serialized',
            }).principalResult;
            
            const cleanedTagResult = tagResult.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
            const tags = cleanedTagResult.match(/<\/?[^>]+>/g);
            if (tags) {
                tags.forEach(tag => uniqueTags.add(tag));
            }

            const attrResult = SaxonJS.transform({
                stylesheetFileName: attrSefPath,
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
        await TagSetC.bulkWrite(tagBulkOps);

        const attrBulkOps = uniqueAttrArray.map(attr => ({
            updateOne: {
                filter: { name: attr.name },
                update: { $setOnInsert: attr },
                upsert: true
            }
        }));
        await AttrSetC.bulkWrite(attrBulkOps);

        return res.status(200).json({ statusCode: "200", status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "fail", message: 'Internal Server Error' });
    }
};

module.exports = IASB_setC_controller;
