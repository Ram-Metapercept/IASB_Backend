const fs = require('fs');
const path = require('path');
const { TagSetA, AttrSetA } = require("../../model/IASBModel/IASB_setA_model");
const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");
const outputId = Math.random().toString(36).substring(7);
// const logPath = path.join(__dirname, `../../../outputLog/${outputId}/log.txt`);

// let logPath = path.join(__dirname, '../../../log.txt');
// const updateLogFile = (newEntries, type) => {
//     if (newEntries.length === 0) {
//         console.log(`No new ${type} to log.`);
//         return;
//     }

//     let existingLog = '';
//     if (fs.existsSync(logPath)) {
//         existingLog = fs.readFileSync(logPath, 'utf8');
//     }

//     const newEntriesToLog = newEntries.filter(name => !existingLog.includes(name));

//     if (newEntriesToLog.length > 0) {
//         let logContent = `************ New ${type} **************\n` + newEntriesToLog.join('\n') + '\n';
//         fs.appendFileSync(logPath, logContent, 'utf8');
//         console.log(`${type} comparison results logged to ${logPath}`);
//     } else {
//         console.log(`No new ${type} to log.`);
//     }
// };
const updateLogFile = (newEntries, type, logPath) => {
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

const getAllTagsSetA = async (req, res) => {
    const { outputId } = req.body.data; // Expect the outputId to be passed in the body of the request
    const logFolderPath = path.join(__dirname, `../../../logOutput/${outputId}`);

    // Ensure the folder exists, create it if it doesn't
    if (!fs.existsSync(logFolderPath)) {
        fs.mkdirSync(logFolderPath, { recursive: true });
    }

    const logPath = path.join(logFolderPath, 'log.txt');
    try {
        const newNames = await compareTags();
        updateLogFile(newNames, 'Tags',logPath);
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
    const { outputId } = req.body.data; // Expect the outputId to be passed in the body of the request
    const logFolderPath = path.join(__dirname, `../../../logOutput/${outputId}`);

    // Ensure the folder exists, create it if it doesn't
    if (!fs.existsSync(logFolderPath)) {
        fs.mkdirSync(logFolderPath, { recursive: true });
    }

    const logPath = path.join(logFolderPath, 'log.txt');
    try {
        const newAttrs = await compareAttributes();
        updateLogFile(newAttrs, 'Attributes', logPath);
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



// const fs = require('fs');
// const path = require('path');
// const { TagSetA, AttrSetA } = require("../../model/IASBModel/IASB_setA_model");
// const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");

// // Shared outputId and logPath
// let outputId = Math.random().toString(36).substring(7);
// const logPath = path.join(__dirname, `../../../outputLog/${outputId}/log.txt`);

// // Ensure log directory exists
// const ensureLogDirectoryExists = () => {
//     const logDir = path.dirname(logPath);
//     if (!fs.existsSync(logDir)) {
//         fs.mkdirSync(logDir, { recursive: true });
//     }
// };
// ensureLogDirectoryExists();

// // Helper function to write log only if new entries are found
// const updateLogFile = (newEntries, type) => {
//     if (newEntries.length === 0) {
//         console.log(`No new ${type} to log.`);
//         return;
//     }

//     let existingLog = '';
//     if (fs.existsSync(logPath)) {
//         existingLog = fs.readFileSync(logPath, 'utf8');
//     }

//     const newEntriesToLog = newEntries.filter(name => !existingLog.includes(name));

//     if (newEntriesToLog.length > 0) {
//         let logContent = `************ New ${type} **************\n` + newEntriesToLog.join('\n') + '\n';
//         fs.appendFileSync(logPath, logContent, 'utf8');
//         console.log(`${type} comparison results logged to ${logPath}`);
//     } else {
//         console.log(`No new ${type} to log.`);
//     }
// };

// // Function to compare and log new tags for SetA
// const getAllTagsSetA = async (req, res) => {
//     try {
//         const newNames = await compareTags();
//         updateLogFile(newNames, 'Tags');
//         res.status(200).json({ message: 'Tags comparison completed, check log.txt for results.' });
//     } catch (error) {
//         console.error('Error comparing tags:', error);
//         res.status(500).json({ message: 'Error comparing tags' });
//     }
// };

// // Helper function to compare tags
// const compareTags = async () => {
//     const allTagsFrom_SetA = await TagSetA.find({});
//     const allTagsFrom_TestFile = await testTagModel.find({});

//     const namesFrom_SetA = new Set(allTagsFrom_SetA.map(tag => tag.name));
//     const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

//     return namesFrom_TestFile.filter(name => !namesFrom_SetA.has(name));
// };

// // Function to compare and log new attributes for SetA
// const getAllAttrSetA = async (req, res) => {
//     try {
//         const newAttrs = await compareAttributes();
//         updateLogFile(newAttrs, 'Attributes');
//         res.status(200).json({ message: 'Attributes comparison completed, check log.txt for results.' });
//     } catch (error) {
//         console.error('Error comparing attributes:', error);
//         res.status(500).json({ message: 'Error comparing attributes' });
//     }
// };

// // Helper function to compare attributes
// const compareAttributes = async () => {
//     const allAttrsFrom_SetA = await AttrSetA.find({});
//     const allAttrsFrom_TestFile = await testAttrModel.find({});

//     const attrNamesFrom_SetA = new Set(allAttrsFrom_SetA.map(attr => attr.name));
//     const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

//     return attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetA.has(name));
// };

// module.exports = { getAllTagsSetA, getAllAttrSetA };


















