
// const fs = require('fs');
// const path = require('path');
// const { TagSetC, AttrSetC } = require("../../model/IASBModel/IASB_setC_model");
// const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

// const contentExistsInLog = (logContent, searchString) => {
//     return logContent.includes(searchString);
// };

// const getAllTagSetC = async (req, res) => {
//     try {
//         const allTagsFrom_SetC = await TagSetC.find({});
//         const allTagsFrom_TestFile = await testTagModel.find({});

//         const namesFrom_SetC = new Set(allTagsFrom_SetC.map(tag => tag.name));
//         const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

//         const newNames = namesFrom_TestFile.filter(name => !namesFrom_SetC.has(name));

//         const logPath = path.join(__dirname, '../../../logC.txt');
//         let logContent = '';
//         if (fs.existsSync(logPath)) {
//             logContent = fs.readFileSync(logPath, 'utf8');
//         }

//         let newLogContent = '';
//         if (newNames.length > 0) {
//             const tagContent = '***********************New Tags********************\n' + newNames.join('\n') + '\n';
//             if (!contentExistsInLog(logContent, tagContent)) {
//                 newLogContent += tagContent;
//             }
//         } else {
//             const noTagContent = 'No new Tag found.\n';
//             if (!contentExistsInLog(logContent, noTagContent)) {
//                 newLogContent += noTagContent;
//             }
//         }

//         if (newLogContent) {
//             fs.appendFileSync(logPath, newLogContent, 'utf8');
//             console.log(`Tag comparison results logged to ${logPath}`);
//         } else {
//             console.log('No new tags to log.');
//         }

//         res.status(200).json({ message: 'Tag comparison completed, check log.txt for results.' });
//     } catch (error) {
//         console.error('Error comparing tags:', error);
//         res.status(500).json({ message: 'Error comparing tags' });
//     }
// };

// const getAllAttributeSetC = async (req, res) => {
//     try {
//         const allAttrsFrom_SetC = await AttrSetC.find({});
//         const allAttrsFrom_TestFile = await testAttrModel.find({});

//         const attrNamesFrom_SetC = new Set(allAttrsFrom_SetC.map(attr => attr.name));
//         const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

//         const newAttrs = attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetC.has(name));

//         const logPath = path.join(__dirname, '../../../log.txt');
//         let logContent = '';

//         if (fs.existsSync(logPath)) {
//             logContent = fs.readFileSync(logPath, 'utf8');
//         }

//         let newLogContent = '';
//         if (newAttrs.length > 0) {
//             const attrContent = '************New attributes**************\n' + newAttrs.join('\n') + '\n';
//             if (!contentExistsInLog(logContent, attrContent)) {
//                 newLogContent += attrContent;
//             }
//         } else {
//             const noAttrContent = 'No new attributes found.\n';
//             if (!contentExistsInLog(logContent, noAttrContent)) {
//                 newLogContent += noAttrContent;
//             }
//         }

//         if (newLogContent) {
//             fs.appendFileSync(logPath, newLogContent, 'utf8');
//             console.log(`Attribute comparison results logged to ${logPath}`);
//         } else {
//             console.log('No new attributes to log.');
//         }

//         res.status(200).json({ message: 'Attribute comparison completed, check log.txt for results.' });
//     } catch (error) {
//         console.error('Error comparing attributes:', error);
//         res.status(500).json({ message: 'Error comparing attributes' });
//     }
// };

// module.exports = { getAllTagSetC, getAllAttributeSetC };


























const fs = require('fs');
const path = require('path');
const { TagSetC, AttrSetC } = require("../../model/IASBModel/IASB_setC_model");
const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

let logPath = path.join(__dirname, '../../../log.txt');

// Helper function to write log only if new entries are found
const updateLogFile = (newEntries, type) => {
    if (newEntries.length === 0) {
        console.log(`No new ${type} to log.`);
        return;
    }

    let existingLog = '';
    if (fs.existsSync(logPath)) {
        existingLog = fs.readFileSync(logPath, 'utf8');
    }

    const newEntriesToLog = newEntries.filter(entry => !existingLog.includes(entry));
    
    if (newEntriesToLog.length > 0) {
        const logContent = `************ New ${type} **************\n` + newEntriesToLog.join('\n') + '\n';
        fs.appendFileSync(logPath, logContent, 'utf8');
        console.log(`${type} comparison results logged to ${logPath}`);
    } else {
        console.log(`No new ${type} to log.`);
    }
};

// Function to compare and log new tags for SetC
const getAllTagSetC = async (req, res) => {
    try {
        const allTagsFrom_SetC = await TagSetC.find({});
        const allTagsFrom_TestFile = await testTagModel.find({});

        const namesFrom_SetC = new Set(allTagsFrom_SetC.map(tag => tag.name));
        const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

        const newNames = namesFrom_TestFile.filter(name => !namesFrom_SetC.has(name));

        updateLogFile(newNames, 'Tags');
        res.status(200).json({ message: 'Tag comparison completed, check log.txt for results.' });
    } catch (error) {
        console.error('Error comparing tags:', error);
        res.status(500).json({ message: 'Error comparing tags' });
    }
};

// Function to compare and log new attributes for SetC
const getAllAttributeSetC = async (req, res) => {
    try {
        const allAttrsFrom_SetC = await AttrSetC.find({});
        const allAttrsFrom_TestFile = await testAttrModel.find({});

        const attrNamesFrom_SetC = new Set(allAttrsFrom_SetC.map(attr => attr.name));
        const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

        const newAttrs = attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetC.has(name));

        updateLogFile(newAttrs, 'Attributes');
        res.status(200).json({ message: 'Attribute comparison completed, check log.txt for results.' });
    } catch (error) {
        console.error('Error comparing attributes:', error);
        res.status(500).json({ message: 'Error comparing attributes' });
    }
};

module.exports = { getAllTagSetC, getAllAttributeSetC };
