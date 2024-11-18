// const fs = require('fs');
// const path = require('path');
// const { TagSetB, AttrSetB } = require("../../model/IASBModel/IASB_setB_model");
// const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

// const contentExistsInLog = (logContent, searchString) => {
//     return logContent.includes(searchString);
// };

// const getAllTagSetB = async (req, res) => {
//     try {
//         const allTagsFrom_SetB = await TagSetB.find({});
//         const allTagsFrom_TestFile = await testTagModel.find({});

//         const namesFrom_SetB = new Set(allTagsFrom_SetB.map(tag => tag.name));
//         const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

//         const newNames = namesFrom_TestFile.filter(name => !namesFrom_SetB.has(name));

//         const logPath = path.join(__dirname, '../../../logB.txt');
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

// const getAllAttributeSetB = async (req, res) => {
//     try {
//         const allAttrsFrom_SetB = await AttrSetB.find({});
//         const allAttrsFrom_TestFile = await testAttrModel.find({});

//         const attrNamesFrom_SetB = new Set(allAttrsFrom_SetB.map(attr => attr.name));
//         const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

//         const newAttrs = attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetB.has(name));

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

// module.exports = { getAllTagSetB, getAllAttributeSetB };




















const fs = require('fs');
const path = require('path');
const { TagSetB, AttrSetB } = require("../../model/IASBModel/IASB_setB_model");
const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

let logPath = path.join(__dirname, '../../../log.txt');

// Helper function to write log only if new entries are found
const updateLogFile = (newEntries, type) => {
    if (newEntries.length === 0) {
        console.log(`No new ${type} to log.`);
        return;
    }
    if (type == "Tags") {
        logPath = logPath;
    } else if (type == "Attributes") {
        logPath = logPath;
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

// Function to compare and log new tags for SetB
const getAllTagSetB = async (req, res) => {
    try {
        const allTagsFrom_SetB = await TagSetB.find({});
        const allTagsFrom_TestFile = await testTagModel.find({});

        const namesFrom_SetB = new Set(allTagsFrom_SetB.map(tag => tag.name));
        const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

        const newNames = namesFrom_TestFile.filter(name => !namesFrom_SetB.has(name));

        updateLogFile(newNames, 'Tags');
        res.status(200).json({ message: 'Tag comparison completed, check logB.txt for results.' });
    } catch (error) {
        console.error('Error comparing tags:', error);
        res.status(500).json({ message: 'Error comparing tags' });
    }
};

// Function to compare and log new attributes for SetB
const getAllAttributeSetB = async (req, res) => {
    try {
        const allAttrsFrom_SetB = await AttrSetB.find({});
        const allAttrsFrom_TestFile = await testAttrModel.find({});

        const attrNamesFrom_SetB = new Set(allAttrsFrom_SetB.map(attr => attr.name));
        const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

        const newAttrs = attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetB.has(name));

        updateLogFile(newAttrs, 'Attributes');
        res.status(200).json({ message: 'Attribute comparison completed, check logB.txt for results.' });
    } catch (error) {
        console.error('Error comparing attributes:', error);
        res.status(500).json({ message: 'Error comparing attributes' });
    }
};

module.exports = { getAllTagSetB, getAllAttributeSetB };



// const fs = require('fs');
// const { promisify } = require('util');
// const path = require('path');
// const { TagSetB, AttrSetB } = require("../../model/IASBModel/IASB_setB_model");
// const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

// const logPath = path.join(__dirname, '../../../log.txt');

// // Promisify fs methods for async use
// const appendFile = promisify(fs.appendFile);
// const readFile = promisify(fs.readFile);
// const fileExists = (path) => promisify(fs.access)(path).then(() => true).catch(() => false);

// // Helper function to write log only if new entries are found
// const updateLogFile = async (newEntries, type) => {
//   if (newEntries.length === 0) {
//     console.log(`No new ${type} to log.`);
//     return;
//   }

//   try {
//     // Read existing log content (if file exists)
//     let existingLog = '';
//     if (await fileExists(logPath)) {
//       existingLog = await readFile(logPath, 'utf8');
//     }

//     // Efficiently filter new entries using Set operations
//     const newEntriesToLog = new Set(newEntries).difference(new Set(existingLog.split('\n')));

//     if (newEntriesToLog.size > 0) {
//       const logContent = `************ New ${type} **************\n` + Array.from(newEntriesToLog).join('\n') + '\n';
//       await appendFile(logPath, logContent, 'utf8');
//       console.log(`${type} comparison results logged to ${logPath}`);
//     } else {
//       console.log(`No new ${type} to log.`);
//     }
//   } catch (error) {
//     console.error(`Error updating log file: ${error}`);
//   }
// };

// // Function to compare and log new tags for SetB
// const getAllTagSetB = async (req, res) => {
//   try {
//     const [allTagsFrom_SetB, allTagsFrom_TestFile] = await Promise.all([
//       TagSetB.find({}),
//       testTagModel.find({})
//     ]);

//     const namesFrom_SetB = new Set(allTagsFrom_SetB.map(tag => tag.name));
//     const newNames = allTagsFrom_TestFile.filter(tag => !namesFrom_SetB.has(tag.name)).map(tag => tag.name);

//     await updateLogFile(newNames, 'Tags');
//     res.status(200).json({ message: 'Tag comparison completed, check log.txt for results.' });
//   } catch (error) {
//     console.error('Error comparing tags:', error);
//     res.status(500).json({ message: 'Error comparing tags' });
//   }
// };

// // Function to compare and log new attributes for SetB
// const getAllAttributeSetB = async (req, res) => {
//   try {
//     const [allAttrsFrom_SetB, allAttrsFrom_TestFile] = await Promise.all([
//       AttrSetB.find({}),
//       testAttrModel.find({})
//     ]);

//     const attrNamesFrom_SetB = new Set(allAttrsFrom_SetB.map(attr => attr.name));
//     const newAttrs = allAttrsFrom_TestFile.filter(attr => !attrNamesFrom_SetB.has(attr.name)).map(attr => attr.name);

//     await updateLogFile(newAttrs, 'Attributes');
//     res.status(200).json({ message: 'Attribute comparison completed, check log.txt for results.' });
//   } catch (error) {
//     console.error('Error comparing attributes:', error);
//     res.status(500).json({ message: 'Error comparing attributes' });
//   }
// };

// module.exports = { getAllTagSetB, getAllAttributeSetB };
