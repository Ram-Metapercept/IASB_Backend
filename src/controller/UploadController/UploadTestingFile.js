const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { promisify } = require('util');
const shell = require('shelljs');

// Promisify fs methods
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Main function to handle file upload and extraction
const UploadTestingFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: false, message: 'No files were uploaded.' });
    }

    const { file } = req;
    const filename = path.parse(file.originalname).name;
    const testingFileDir = path.join(__dirname, '../../../output', 'TestingFile');
    const extractionDir = path.join(testingFileDir, filename);

    try {
        // Clear contents of TestingFile directory, excluding the new extraction directory
        await clearTestingFileDirectory(testingFileDir, extractionDir);

        // Create extraction directory
        await mkdir(extractionDir, { recursive: true });

        // Extract the zip file
        const zip = new AdmZip(file.path);
        zip.extractAllTo(extractionDir, true);

        // Clean up and send success response
        await unlink(file.path);
        res.status(200).json({ status: true, message: 'File uploaded successfully' });
    } catch (err) {
        console.error('Error during file processing:', err);
        res.status(500).json({ status: false, message: 'Error during extraction' });
    }
};

// Function to clear the TestingFile directory except for the specified directory
const clearTestingFileDirectory = async (dirPath, excludeDir) => {
    const items = await readdir(dirPath);
    await Promise.all(items.map(async (item) => {
        const itemPath = path.join(dirPath, item);
        if (itemPath === excludeDir) return;

        const itemStat = await stat(itemPath);
        if (itemStat.isDirectory()) {
            shell.rm('-rf', itemPath); // Remove directory
        } else {
            await unlink(itemPath); // Remove file
        }
    }));
};

module.exports = UploadTestingFile;
