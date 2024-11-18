
// const fs = require('fs');
// const path = require('path');
// const { TagSetA, AttrSetA } = require("../../model/IASBModel/IASB_setA_model");
// const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

// const logPath = path.join(__dirname, '../../../logA.txt');

// const getAllTagsSetA = async (req, res) => {
//     try {
//         const newNames = await compareTags();
//         let existingLog = '';
//         if (fs.existsSync(logPath)) {
//             existingLog = fs.readFileSync(logPath, 'utf8');
//         }

//         let logContent = '';
//         const newTagsToLog = newNames.filter(name => !existingLog.includes(name));

//         if (newTagsToLog.length > 0) {
//             logContent += '***********************New Tags********************\n' + newTagsToLog.join('\n') + '\n';
//         } else {
//             logContent += 'No new Tag found.\n';
//         }

//         if (newTagsToLog.length > 0) {
//             fs.writeFileSync(logPath, logContent, 'utf8');
//             console.log(`Tags comparison results logged to ${logPath}`);
//         } else {
//             console.log('No new tags to log.');
//         }

//         res.status(200).json({ message: 'Tags comparison completed, check log.txt for results.' });
//     } catch (error) {
//         console.error('Error comparing tags:', error);
//         res.status(500).json({ message: 'Error comparing tags' });
//     }
// };

// const compareTags = async () => {
//     const allTagsFrom_SetA = await TagSetA.find({});
//     const allTagsFrom_TestFile = await testTagModel.find({});

//     const namesFrom_SetA = new Set(allTagsFrom_SetA.map(tag => tag.name));
//     const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

//     return namesFrom_TestFile.filter(name => !namesFrom_SetA.has(name));
// };

// const getAllAttrSetA = async (req, res) => {
//     try {
//         const newAttrs = await compareAttributes();

//         let existingLog = '';
//         if (fs.existsSync(logPath)) {
//             existingLog = fs.readFileSync(logPath, 'utf8');
//         }

//         let logContent = '';
//         const newAttrsToLog = newAttrs.filter(name => !existingLog.includes(name));

//         if (newAttrsToLog.length > 0) {
//             logContent += '************New attributes**************\n' + newAttrsToLog.join('\n') + '\n';
//         } else {
//             logContent += 'No new attributes found.\n';
//         }

//         if (newAttrsToLog.length > 0) {
//             fs.writeFileSync(logPath, logContent, 'utf8');
//             console.log(`Attributes comparison results logged to ${logPath}`);
//         } else {
//             console.log('No new attributes to log.');
//         }

//         res.status(200).json({ message: 'Attributes comparison completed, check log.txt for results.' });
//     } catch (error) {
//         console.error('Error comparing attributes:', error);
//         res.status(500).json({ message: 'Error comparing attributes' });
//     }
// };

// const compareAttributes = async () => {
//     const allAttrsFrom_SetA = await AttrSetA.find({});
//     const allAttrsFrom_TestFile = await testAttrModel.find({});

//     const attrNamesFrom_SetA = new Set(allAttrsFrom_SetA.map(attr => attr.name));
//     const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

//     return attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetA.has(name));
// };

// module.exports = { getAllTagsSetA, getAllAttrSetA };































const fs = require('fs');
const path = require('path');
const { TagSetA, AttrSetA } = require("../../model/IASBModel/IASB_setA_model");
const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

const logPath = path.join(__dirname, '../../../log.txt');

const updateLogFile = (newEntries, type) => {
    if (newEntries.length === 0) {
        console.log(`No new ${type} to log.`);
        return;
    }

    let existingLog = '';
    if (fs.existsSync(logPath)) {
        existingLog = fs.readFileSync(logPath, 'utf8');
    }

    const newEntriesToLog = newEntries.filter(name => !existingLog.includes(name));

    if (newEntriesToLog.length > 0) {
        let logContent = `************ New ${type} **************\n` + newEntriesToLog.join('\n') + '\n';
        fs.appendFileSync(logPath, logContent, 'utf8');
        console.log(`${type} comparison results logged to ${logPath}`);
    } else {
        console.log(`No new ${type} to log.`);
    }
};

const getAllTagsSetA = async (req, res) => {
    try {
        const newNames = await compareTags();
        updateLogFile(newNames, 'Tags');
        res.status(200).json({ message: 'Tags comparison completed, check logA.txt for results.' });
    } catch (error) {
        console.error('Error comparing tags:', error);
        res.status(500).json({ message: 'Error comparing tags' });
    }
};

const compareTags = async () => {
    const allTagsFrom_SetA = await TagSetA.find({});
    const allTagsFrom_TestFile = await testTagModel.find({});

    const namesFrom_SetA = new Set(allTagsFrom_SetA.map(tag => tag.name));
    const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

    return namesFrom_TestFile.filter(name => !namesFrom_SetA.has(name));
};

const getAllAttrSetA = async (req, res) => {
    try {
        const newAttrs = await compareAttributes();
        updateLogFile(newAttrs, 'Attributes');
        res.status(200).json({ message: 'Attributes comparison completed, check logA.txt for results.' });
    } catch (error) {
        console.error('Error comparing attributes:', error);
        res.status(500).json({ message: 'Error comparing attributes' });
    }
};

const compareAttributes = async () => {
    const allAttrsFrom_SetA = await AttrSetA.find({});
    const allAttrsFrom_TestFile = await testAttrModel.find({});

    const attrNamesFrom_SetA = new Set(allAttrsFrom_SetA.map(attr => attr.name));
    const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

    return attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetA.has(name));
};

module.exports = { getAllTagsSetA, getAllAttrSetA };
