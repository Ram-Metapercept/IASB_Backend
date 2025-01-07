const fs = require('fs');
const path = require('path');
const { TagSetC, AttrSetC } = require("../../model/IASBModel/IASB_setC_model");
const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model");
let logPath = path.join(__dirname, '../../../log.txt');
// const updateLogFile = (newEntries, type) => {
//     if (newEntries.length === 0) {
//         console.log(`No new ${type} to log.`);
//         return;
//     }

//     let existingLog = '';
//     if (fs.existsSync(logPath)) {
//         existingLog = fs.readFileSync(logPath, 'utf8');
//     }

//     const newEntriesToLog = newEntries.filter(entry => !existingLog.includes(entry));
    
//     if (newEntriesToLog.length > 0) {
//         const logContent = `************ New ${type} **************\n` + newEntriesToLog.join('\n') + '\n';
//         fs.appendFileSync(logPath, logContent, 'utf8');
//         console.log(`${type} comparison results logged to ${logPath}`);
//     } else {
//         console.log(`No new ${type} to log.`);
//     }
// };

// Function to compare and log new tags for SetC
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



const getAllTagSetC = async (req, res) => {

    const { outputId } = req.body.data; // Expect the outputId to be passed in the body of the request
    const logFolderPath = path.join(__dirname, `../../../logOutput/${outputId}`);
    console.log({req})
    // Ensure the folder exists, create it if it doesn't
    if (!fs.existsSync(logFolderPath)) {
        fs.mkdirSync(logFolderPath, { recursive: true });
    }

    const logPath = path.join(logFolderPath, 'log.txt');
    try {
        const allTagsFrom_SetC = await TagSetC.find({});
        const allTagsFrom_TestFile = await testTagModel.find({});

        const namesFrom_SetC = new Set(allTagsFrom_SetC.map(tag => tag.name));
        const namesFrom_TestFile = allTagsFrom_TestFile.map(tag => tag.name);

        const newNames = namesFrom_TestFile.filter(name => !namesFrom_SetC.has(name));

        updateLogFile(newNames, 'Tags',logPath);
        res.status(200).json({ message: 'Tag comparison completed, check log.txt for results.',   outputId: outputId   });
    } catch (error) {
        console.error('Error comparing tags:', error);
        res.status(500).json({ message: 'Error comparing tags' });
    }
};

// Function to compare and log new attributes for SetC
const getAllAttributeSetC = async (req, res) => {
    console.log(req)
    const { outputId } = req.body.data; // Expect the outputId to be passed in the body of the request
    const logFolderPath = path.join(__dirname, `../../../logOutput/${outputId}`);

    // Ensure the folder exists, create it if it doesn't
    if (!fs.existsSync(logFolderPath)) {
        fs.mkdirSync(logFolderPath, { recursive: true });
    }

    const logPath = path.join(logFolderPath, 'log.txt');
    try {
        const allAttrsFrom_SetC = await AttrSetC.find({});
        const allAttrsFrom_TestFile = await testAttrModel.find({});

        const attrNamesFrom_SetC = new Set(allAttrsFrom_SetC.map(attr => attr.name));
        const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map(attr => attr.name);

        const newAttrs = attrNamesFrom_TestFile.filter(name => !attrNamesFrom_SetC.has(name));
        updateLogFile(newAttrs, 'Attributes', logPath);
        res.status(200).json({ message: 'Attribute comparison completed, check log.txt for results.', outputId: outputId });
    } catch (error) {
        console.error('Error comparing attributes:', error);
        res.status(500).json({ message: 'Error comparing attributes' });
    }
};

module.exports = { getAllTagSetC, getAllAttributeSetC };

















