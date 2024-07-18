const IASB_setA_model = require("../../../model/Tags/IASB_setA_model");
const fs = require('fs');
const getAllFiles = require("../../../utils/getAllFiles");
const path = require('path');
const { execSync } = require("child_process"); 
const SaxonJS = require('saxon-js');
const zipFilePath = path.join(__dirname, '../../../../output/IASB_SetA');
const IASB_setA_controller = async (req, res) => {
    try {
        const allFiles = getAllFiles(zipFilePath);
      
        const ditaFiles = allFiles.filter((file) => file.endsWith('.dita'));
     
         
        execSync(
            `xslt3 -t -xsl:${path.resolve(
                __dirname,
                '../../../../public/XSLT_Files/extract_elements.xsl'
              )} -export:test.sef.json -nogo`,
        );
       
        const uniqueTags = new Set();
        for (const ditaInput of ditaFiles) {
       
            let abso = path.resolve(ditaInput);
            const result = SaxonJS.transform({
                stylesheetFileName: `./test.sef.json`,
                sourceFileName: `${abso}`,
                destination: "serialized",
            }).principalResult;
           
            const cleanedResult = result.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, '');
            const tags = cleanedResult.match(/<\/?[^>]+>/g);
            if (tags) {
                tags.forEach(tag => uniqueTags.add(tag));
            }  
        }
        const uniqueTagsArray = Array.from(uniqueTags).map(tag => ({ name: tag }));

        await IASB_setA_model.insertMany(uniqueTagsArray, { ordered: false })
            .catch(err => {
                if (err.code !== 11000) { 
                    throw err;
                }
            });
            return res.status(200).json({statusCode:"200",status: "success"});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "fail", message: 'Internal Server Error' });
        }
      
};

module.exports = IASB_setA_controller;




