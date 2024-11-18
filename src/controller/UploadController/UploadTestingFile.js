// const express = require('express');
// const fs = require('fs');
// const AdmZip = require('adm-zip');
// const path = require('path');
// const { setInputFileName } = require('../../stateManagement/state');

// const uploadTestingFile = async (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No files were uploaded.');
//     }
//     const file = req.file;
//     const filename = path.basename(file.originalname);

//     setInputFileName(filename)
//     const extractionDir = path.join(__dirname, '../../../output', 'TestingFile');
//     try {
//         if (fs.existsSync(extractionDir)) {
//             deleteDirectoryRecursively(extractionDir);
//         }
//         await fs.promises.mkdir(extractionDir, { recursive: true });
//         const zip = new AdmZip(file.path);
//         zip.extractAllTo(extractionDir, true);
//         res.status(200).send({status:true, message: 'File Uploaded successfully' });
//         await fs.promises.unlink(file.path);
//     } catch (err) {
//         console.error('Error during extraction:', err);
//         res.status(500).send('Error during extraction');
//     }
// };

// const deleteDirectoryRecursively = (dirPath) => {
//     if (fs.existsSync(dirPath)) {
//         const files = fs.readdirSync(dirPath);
//         files.forEach((file) => {
//             const filePath = path.join(dirPath, file);
//             if (fs.statSync(filePath).isDirectory()) {
//                 deleteDirectoryRecursively(filePath);
//             } else {
//                 fs.unlinkSync(filePath);
//             }
//         });
//         fs.rmdirSync(dirPath);
//     }
// };
// module.exports = uploadTestingFile;





// const fs = require('fs');
// const path = require('path');
// const AdmZip = require('adm-zip');
// const { promisify } = require('util');
// const { setInputFileName } = require('../../stateManagement/state');

// // Promisify fs methods
// const mkdir = promisify(fs.mkdir);
// const unlink = promisify(fs.unlink);
// const rmdir = promisify(fs.rmdir);
// const readdir = promisify(fs.readdir);
// const stat = promisify(fs.stat);

// // Main function to handle file upload and extraction
// const UploadTestingFile = async (req, res) => {
//     // Check for file in request
//     if (!req.file) {
//         return res.status(400).json({ status: false, message: 'No files were uploaded.' });
//     }

//     const { file } = req;
//     const filename = path.parse(file.originalname).name;
//     const testingFileDir = path.join(__dirname, '../../../output', 'TestingFile');
//     const extractionDir = path.join(testingFileDir, filename);

//     try {
//         // Delete all existing directories in the TestingFile folder
//         await clearTestingFileDirectory(testingFileDir);

//         // Create extraction directory
//         await mkdir(extractionDir, { recursive: true });

//         // Extract the zip file
//         const zip = new AdmZip(file.path);
//         zip.extractAllTo(extractionDir, true);

//         // Clean up and send success response
//         await unlink(file.path);
//         res.status(200).json({ status: true, message: 'File uploaded successfully' });
//     } catch (err) {
//         console.error('Error during file processing:', err);
//         res.status(500).json({ status: false, message: 'Error during extraction' });
//     }
// };

// // Delete all folders in the TestingFile directory
// const clearTestingFileDirectory = async (dirPath) => {
//     const items = await readdir(dirPath);
//     await Promise.all(items.map(async (item) => {
//         const itemPath = path.join(dirPath, item);
//         const itemStat = await stat(itemPath);
        
//         if (itemStat.isDirectory()) {
//             await deleteDirectoryRecursively(itemPath);
//         }
//     }));
// };

// // Asynchronously delete directory contents recursively
// const deleteDirectoryRecursively = async (dirPath) => {
//     const files = await readdir(dirPath);
//     await Promise.all(files.map(async (file) => {
//         const filePath = path.join(dirPath, file);
//         const fileStat = await stat(filePath);

//         if (fileStat.isDirectory()) {
//             await deleteDirectoryRecursively(filePath);
//         } else {
//             await unlink(filePath);
//         }
//     }));
    
//     await rmdir(dirPath);
// };

// // Utility function to check if a directory exists
// const dirExists = async (dirPath) => {
//     try {
//         await stat(dirPath);
//         return true;
//     } catch {
//         return false;
//     }
// };

// module.exports = UploadTestingFile;



// const fs = require('fs');
// const path = require('path');
// const AdmZip = require('adm-zip');
// const { promisify } = require('util');

// // Promisify fs methods
// const mkdir = promisify(fs.mkdir);
// const unlink = promisify(fs.unlink);
// const rmdir = promisify(fs.rmdir);
// const readdir = promisify(fs.readdir);
// const stat = promisify(fs.stat);

// // Main function to handle file upload and extraction
// const UploadTestingFile = async (req, res) => {
//     // Check for file in request
//     if (!req.file) {
//         return res.status(400).json({ status: false, message: 'No files were uploaded.' });
//     }

//     const { file } = req;
//     const filename = path.parse(file.originalname).name;
//     const testingFileDir = path.join(__dirname, '../../../output', 'TestingFile');
//     const extractionDir = path.join(testingFileDir, filename);

//     try {
//         // Delete all existing files and directories in the TestingFile folder
//         await clearTestingFileDirectory(testingFileDir);

//         // Create extraction directory
//         await mkdir(extractionDir, { recursive: true });

//         // Extract the zip file
//         const zip = new AdmZip(file.path);
//         zip.extractAllTo(extractionDir, true);

//         // Clean up and send success response
//         await unlink(file.path);
//         res.status(200).json({ status: true, message: 'File uploaded successfully' });
//     } catch (err) {
//         console.error('Error during file processing:', err);
//         res.status(500).json({ status: false, message: 'Error during extraction' });
//     }
// };

// // Delete all files and folders in the TestingFile directory
// const clearTestingFileDirectory = async (dirPath) => {
//     const items = await readdir(dirPath);
//     await Promise.all(items.map(async (item) => {
//         const itemPath = path.join(dirPath, item);
//         const itemStat = await stat(itemPath);
        
//         if (itemStat.isDirectory()) {
//             await deleteDirectoryRecursively(itemPath);
//         } else {
//             await unlink(itemPath); // Delete files
//         }
//     }));
// };

// // Asynchronously delete directory contents recursively
// const deleteDirectoryRecursively = async (dirPath) => {
//     const files = await readdir(dirPath);
//     await Promise.all(files.map(async (file) => {
//         const filePath = path.join(dirPath, file);
//         const fileStat = await stat(filePath);

//         if (fileStat.isDirectory()) {
//             await deleteDirectoryRecursively(filePath);
//         } else {
//             await unlink(filePath); // Delete files inside the directory
//         }
//     }));
    
//     await rmdir(dirPath); // Remove the empty directory
// };

// // Utility function to check if a directory exists
// const dirExists = async (dirPath) => {
//     try {
//         await stat(dirPath);
//         return true;
//     } catch {
//         return false;
//     }
// };

// module.exports = UploadTestingFile;

















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
