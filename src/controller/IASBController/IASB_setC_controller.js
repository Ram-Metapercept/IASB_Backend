// const { TagSetC, AttrSetC } = require("../../model/IASBModel/IASB_setC_model");
// const getAllFiles = require("../../utils/getAllFiles");
// const path = require('path');
// const fs = require('fs');
// const { execSync } = require("child_process"); 
// const SaxonJS = require('saxon-js');
// const zipFilePath = path.join(__dirname, '../../../output/IASB/IASB_SetC');

// const IASB_setC_controller = async (req, res) => {
//     try {
//         const allFiles = getAllFiles(zipFilePath);
//         const ditaFiles = allFiles.filter(file => file.endsWith('.xml') || file.endsWith('.dita'));

//         const tagSefPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetC_tag.sef.json');
//         const attrSefPath = path.resolve(__dirname, '../../../testJsonFiles/IASB_SetC_attr.sef.json');

    
//         const testJsonDir = path.dirname(tagSefPath);
//         if (!fs.existsSync(testJsonDir)) {
//             fs.mkdirSync(testJsonDir, { recursive: true });
//         }

//         execSync(
//             `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_elements.xsl')} -export:${tagSefPath} -nogo`
//         );
//         execSync(
//             `xslt3 -t -xsl:${path.resolve(__dirname, '../../../public/XSLT_Files/extract_attributes.xsl')} -export:${attrSefPath} -nogo`
//         );
//         if (!fs.existsSync(tagSefPath) || !fs.existsSync(attrSefPath)) {
//             throw new Error(`XSLT transformation failed to create required JSON files.`);
//         }

//         const uniqueTags = new Set();
//         const uniqueAttr = new Set();

//         for (const ditaInput of ditaFiles) {
//             const abso = path.resolve(ditaInput);

//             const tagResult = SaxonJS.transform({
//                 stylesheetFileName: tagSefPath,
//                 sourceFileName: abso,
//                 destination: 'serialized',
//             }).principalResult;
            
//             const cleanedTagResult = tagResult.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
//             const tags = cleanedTagResult.match(/<\/?[^>]+>/g);
//             if (tags) {
//                 tags.forEach(tag => uniqueTags.add(tag));
//             }

//             const attrResult = SaxonJS.transform({
//                 stylesheetFileName: attrSefPath,
//                 sourceFileName: abso,
//                 destination: 'serialized',
//             }).principalResult;
            
//             const cleanedAttrResult = attrResult.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
//             const attributes = cleanedAttrResult.match(/<\/?[^>]+>/g);
//             if (attributes) {
//                 attributes.forEach(attr => uniqueAttr.add(attr));
//             }
//         }

//         const uniqueTagsArray = Array.from(uniqueTags).map(tag => ({ name: tag }));
//         const uniqueAttrArray = Array.from(uniqueAttr).map(attr => ({ name: attr }));

//         const tagBulkOps = uniqueTagsArray.map(tag => ({
//             updateOne: {
//                 filter: { name: tag.name },
//                 update: { $setOnInsert: tag },
//                 upsert: true
//             }
//         }));
//         await TagSetC.bulkWrite(tagBulkOps);

//         const attrBulkOps = uniqueAttrArray.map(attr => ({
//             updateOne: {
//                 filter: { name: attr.name },
//                 update: { $setOnInsert: attr },
//                 upsert: true
//             }
//         }));
//         await AttrSetC.bulkWrite(attrBulkOps);

//         return res.status(200).json({ statusCode: "200", status: "success" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "fail", message: 'Internal Server Error' });
//     }
// };

// module.exports = IASB_setC_controller;





















const { TagSetC, AttrSetC } = require("../../model/IASBModel/IASB_setC_model");
const getAllFiles = require("../../utils/getAllFiles");
const path = require('path');
const fs = require('fs');
const { execSync } = require("child_process");
const SaxonJS = require('saxon-js');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache with 1-hour expiration
const zipFilePath = path.join(__dirname, '../../../output/IASB/IASB_SetC');

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

    await Promise.all(ditaFiles.map(async (ditaInput) => {
        const abso = path.resolve(ditaInput);

        // Extract tags
        const cachedTags = cache.get(`tags-${abso}`);
        if (cachedTags) {
            cachedTags.forEach(tag => uniqueTags.add(tag));
        } else {
            const tagResult = SaxonJS.transform({
                stylesheetFileName: tagSefPath,
                sourceFileName: abso,
                destination: 'serialized',
            }).principalResult;

            const tags = tagResult.match(/<\/?[^>]+>/g) || [];
            cache.set(`tags-${abso}`, tags);
            tags.forEach(tag => uniqueTags.add(tag));
        }

        // Extract attributes
        const cachedAttrs = cache.get(`attrs-${abso}`);
        if (cachedAttrs) {
            cachedAttrs.forEach(attr => uniqueAttr.add(attr));
        } else {
            const attrResult = SaxonJS.transform({
                stylesheetFileName: attrSefPath,
                sourceFileName: abso,
                destination: 'serialized',
            }).principalResult;

            const attributes = attrResult.match(/<\/?[^>]+>/g) || [];
            cache.set(`attrs-${abso}`, attributes);
            attributes.forEach(attr => uniqueAttr.add(attr));
        }
    }));

    return { uniqueTags, uniqueAttr };
};

const IASB_setC_controller = async (req, res) => {
    try {
        const allFiles = getAllFiles(zipFilePath);
        const ditaFiles = allFiles.filter(file => file.endsWith('.xml') || file.endsWith('.dita'));

        // Get or create SEF paths with caching
        const tagSefPath = getOrCreateSEF(
            'tag-sef',
            path.resolve(__dirname, '../../../public/XSLT_Files/extract_elements.xsl'),
            path.resolve(__dirname, '../../../testJsonFiles/IASB_SetC_tag.sef.json')
        );

        const attrSefPath = getOrCreateSEF(
            'attr-sef',
            path.resolve(__dirname, '../../../public/XSLT_Files/extract_attributes.xsl'),
            path.resolve(__dirname, '../../../testJsonFiles/IASB_SetC_attr.sef.json')
        );

        // Extract unique tags and attributes
        const { uniqueTags, uniqueAttr } = await extractUniqueElements(ditaFiles, tagSefPath, attrSefPath);

        // Prepare MongoDB bulk operations
        const tagBulkOps = Array.from(uniqueTags).map(tag => ({
            updateOne: {
                filter: { name: tag },
                update: { $setOnInsert: { name: tag } },
                upsert: true
            }
        }));

        const attrBulkOps = Array.from(uniqueAttr).map(attr => ({
            updateOne: {
                filter: { name: attr },
                update: { $setOnInsert: { name: attr } },
                upsert: true
            }
        }));

        // Perform database operations
        await Promise.all([
            TagSetC.bulkWrite(tagBulkOps),
            AttrSetC.bulkWrite(attrBulkOps)
        ]);

        return res.status(200).json({ statusCode: "200", status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "fail", message: 'Internal Server Error' });
    }
};

module.exports = IASB_setC_controller;
