const express = require('express');
const fs = require('fs');
const AdmZip = require('adm-zip');
const path = require('path');

const uploadFile=  async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.file;
    const extractionDir = path.join(__dirname,"../../../output","IASB_SetA");
    
    // const outputFile = path.join(__dirname,"../../../output");
    // const filePath = path.join(__dirname, `${file.path}`);
    if (!fs.existsSync(extractionDir)) {
        fs.mkdirSync(extractionDir);
    }

    try {
        const zip = new AdmZip(file.path);
        zip.extractAllTo(extractionDir, true);
        // await cleanInputDirectory(filePath);

        const allFiles = getAllFiles(extractionDir);
        const ditaMapFiles = allFiles.filter((file) => file.endsWith('.ditamap'));
        // ditaMapFiles.forEach(processDitaMap);
        res.status(200).send({ message: "Success"});
    } catch (err) {
        console.error('Error during extraction:', err);
        res.status(500).send('Error during extraction');
    }
};

  const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
};



module.exports = uploadFile
