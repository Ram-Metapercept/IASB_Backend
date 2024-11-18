
// const path = require('path');
// const fs = require('fs/promises');
// const AdmZip = require('adm-zip');
// const modifyXmlStructure = require('../utils/modifyXmlForBackMatterAndAppendix.js');
// const getAllFiles = require('../utils/getAllFiles');
// const { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles } = require('../utils/ditamapNavtitleUpdate.js');

// const processDitaFile = async (filePath) => {
//     try {
//         return await fs.readFile(filePath, 'utf8');
//     } catch (error) {
//         console.error(`Error reading DITA file (${filePath}): ${error.message}`);
//         throw new Error(`Failed to process DITA file: ${filePath}`);
//     }
// };


// const updateDITAMaps = async (filePath) => {
//     try {
//         await Promise.all([
//             updateDITAMapWithNavTitles(filePath),
//             updateMainDITAMapWithNavTitles(filePath)
//         ]);
//     } catch (error) {
//         console.error(`Error updating DITA maps for file (${filePath}): ${error.message}`);
//         throw new Error(`Failed to update DITA maps for file: ${filePath}`);
//     }
// };


// const modifyDitaContent = (ditaContent) => {
//     return modifyXmlStructure(ditaContent)
//         .replace(/<(appendices|appendix|backmatter)>(.*?)<\/\1>/g, '<topicref>$2</topicref>');
// };

// const processDitaFilesAndZip = async (ditaFiles) => {
//     const outputDir = path.join(__dirname, '../../output');
//     const zipFilePath = path.join(outputDir, 'FinalOutput.zip');
//     const tempProcessingDir = path.join(outputDir, 'TestingFile');

//     try {

//         await Promise.all(ditaFiles.map(async (filePath) => {
//             const ditaContent = await processDitaFile(filePath);
//             const modifiedContent = modifyDitaContent(ditaContent);

//             await fs.writeFile(filePath, modifiedContent, 'utf8');
//             await updateDITAMaps(filePath);
//         }));

//         const zip = new AdmZip();
//         const processedFiles = await getAllFiles(tempProcessingDir);

//         processedFiles.forEach((file) => {
//             const relativePath = path.relative(tempProcessingDir, file);
//             zip.addLocalFile(file, path.dirname(relativePath));
//         });

//         zip.writeZip(zipFilePath);
//         console.log(`ZIP file created successfully at ${zipFilePath}`);
//     } catch (error) {
//         console.error(`Error processing DITA files and creating ZIP: ${error.message}`);
//         throw new Error('Failed to process DITA files and create ZIP.');
//     }
// };

// module.exports = processDitaFilesAndZip;







// const path = require('path');
// const { readFile, writeFile } = require('fs/promises');
// const AdmZip = require('adm-zip');
// const modifyXmlForBackMatterAndAppendix = require('../utils/modifyXmlForBackMatterAndAppendix.js');
// const getAllFiles = require('../utils/getAllFiles');
// const { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles } = require('../utils/ditamapNavtitleUpdate.js');
// const util = require('util');
// const fs = require('fs');
// const readdir = util.promisify(fs.readdir);
// const OUTPUT_DIR = path.join(__dirname, '../../output');
// const TEMP_PROCESSING_DIR = path.join(OUTPUT_DIR, 'TestingFile');
// const ZIP_FILE_PATH = path.join(OUTPUT_DIR, `FinalOutput.zip`);
// async function getFolderNames() {
//     try {
//         const files = await fs.readdir(TEMP_PROCESSING_DIR, { withFileTypes: true });
//         const folders = files
//             .filter(file => file.isDirectory())
//             .map(folder => folder.name);
//         return folders.length > 0 ? folders[0] : null; // Return null if no directories found
//     } catch (error) {
//         console.error('Error reading directory:', error);
//         return null;
//     }
// }

// const d =await getFolderNames();
// console.log({d})
// // if (d) { // Check if 'd' is not null before using it
// //     let ZIP_FILE_PATH = path.join(OUTPUT_DIR, `${d}.zip`);
// //     console.log('ZIP file path:', ZIP_FILE_PATH);
// // } else {
// //     console.log('No directories found.');
// // }
// const processDitaFile = async (filePath) => {
//     try {
//         return await readFile(filePath, 'utf8');
//     } catch (error) {
//         console.error(`Error reading DITA file (${filePath}): ${error.message}`);
//         throw new Error(`Failed to process DITA file: ${filePath}`);
//     }
// };

// const updateDITAMaps = async (filePath) => {
//     try {
//         await Promise.all([
//             updateDITAMapWithNavTitles(filePath),
//             updateMainDITAMapWithNavTitles(filePath),
//         ]);
//     } catch (error) {
//         console.error(`Error updating DITA maps for file (${filePath}): ${error.message}`);
//         throw new Error(`Failed to update DITA maps for file: ${filePath}`);
//     }
// };

// const modifyDitaContent = (ditaContent) =>
//     modifyXmlForBackMatterAndAppendix(ditaContent).replace(/<(appendices|appendix|backmatter)>(.*?)<\/\1>/g, '<topicref>$2</topicref>');

// const processAndSaveDitaFile = async (filePath) => {
//     const ditaContent = await processDitaFile(filePath);
//     const modifiedContent = modifyDitaContent(ditaContent);

//     await writeFile(filePath, modifiedContent, 'utf8');
//     await updateDITAMaps(filePath);
// };

// const createZipFromDirectory = async (directoryPath, zipFilePath) => {
//     const zip = new AdmZip();
//     const files = await getAllFiles(directoryPath);

//     files.forEach((file) => {
//         const relativePath = path.relative(directoryPath, file);
//         zip.addLocalFile(file, path.dirname(relativePath));
//     });

//     zip.writeZip(zipFilePath);
//     console.log(`ZIP file created successfully at ${zipFilePath}`);
// };

// const processDitaFilesAndZip = async (ditaFiles) => {
//     try {
//         await Promise.all(ditaFiles.map(processAndSaveDitaFile));
//         await createZipFromDirectory(TEMP_PROCESSING_DIR, ZIP_FILE_PATH);
//     } catch (error) {
//         console.error(`Error processing DITA files and creating ZIP: ${error.message}`);
//         throw new Error('Failed to process DITA files and create ZIP.');
//     }
// };

// module.exports = processDitaFilesAndZip;


















// const path = require('path');
// const { readFile, writeFile, readdir } = require('fs/promises');
// const AdmZip = require('adm-zip');
// const modifyXmlForBackMatterAndAppendix = require('../utils/modifyXmlForBackMatterAndAppendix.js');
// const getAllFiles = require('../utils/getAllFiles');
// const { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles } = require('../utils/ditamapNavtitleUpdate.js');

// const OUTPUT_DIR = path.join(__dirname, '../../output');
// const TEMP_PROCESSING_DIR = path.join(OUTPUT_DIR, 'TestingFile');


// async function getFolderNames() {
//     try {
//         const files = await readdir(TEMP_PROCESSING_DIR, { withFileTypes: true });
//         const folders = files
//             .filter(file => file.isDirectory())
//             .map(folder => folder.name);
//         return folders.length > 0 ? folders[0] : null;
//     } catch (error) {
//         console.error('Error reading directory:', error);
//         return null;
//     }
// }

// (async () => {
//     const d = await getFolderNames(); 
//     console.log({d});
//     if (d) {
//         ZIP_FILE_PATH = path.join(OUTPUT_DIR, `${d}.zip`);

//     } else {
//         console.log('No directories found.');
//     }
// })();

// const processDitaFile = async (filePath) => {
//     try {
//         return await readFile(filePath, 'utf8');
//     } catch (error) {
//         console.error(`Error reading DITA file (${filePath}): ${error.message}`);
//         throw new Error(`Failed to process DITA file: ${filePath}`);
//     }
// };

// const updateDITAMaps = async (filePath) => {
//     try {
//         await Promise.all([
//             updateDITAMapWithNavTitles(filePath),
//             updateMainDITAMapWithNavTitles(filePath),
//         ]);
//     } catch (error) {
//         console.error(`Error updating DITA maps for file (${filePath}): ${error.message}`);
//         throw new Error(`Failed to update DITA maps for file: ${filePath}`);
//     }
// };

// const modifyDitaContent = (ditaContent) =>
//     modifyXmlForBackMatterAndAppendix(ditaContent).replace(/<(appendices|appendix|backmatter)>(.*?)<\/\1>/g, '<topicref>$2</topicref>');

// const processAndSaveDitaFile = async (filePath) => {
//     const ditaContent = await processDitaFile(filePath);
//     const modifiedContent = modifyDitaContent(ditaContent);

//     await writeFile(filePath, modifiedContent, 'utf8');
//     await updateDITAMaps(filePath);
// };

// const createZipFromDirectory = async (directoryPath, zipFilePath) => {
//     const zip = new AdmZip();
//     const files = await getAllFiles(directoryPath);

//     files.forEach((file) => {
//         const relativePath = path.relative(directoryPath, file);
//         zip.addLocalFile(file, path.dirname(relativePath));
//     });

//     zip.writeZip(zipFilePath);
//     console.log(`ZIP file created successfully at ${zipFilePath}`);
// };

// const processDitaFilesAndZip = async (ditaFiles) => {
//     try {
//         await Promise.all(ditaFiles.map(processAndSaveDitaFile));
//         await createZipFromDirectory(TEMP_PROCESSING_DIR, ZIP_FILE_PATH);
//     } catch (error) {
//         console.error(`Error processing DITA files and creating ZIP: ${error.message}`);
//         throw new Error('Failed to process DITA files and create ZIP.');
//     }
// };

// module.exports = processDitaFilesAndZip;











const path = require('path');
const { readFile, writeFile, readdir, mkdir } = require('fs/promises');
const AdmZip = require('adm-zip');
const modifyXmlForBackMatterAndAppendix = require('../utils/modifyXmlForBackMatterAndAppendix.js');
const getAllFiles = require('../utils/getAllFiles');
const { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles } = require('../utils/ditamapNavtitleUpdate.js');
const OUTPUT_DIR = path.join(__dirname, '../../output');
const TEMP_PROCESSING_DIR = path.join(OUTPUT_DIR, 'TestingFile');
const outputId = Math.random().toString(36).substring(7);
const OutputPath = path.join(OUTPUT_DIR, "downloads", outputId);
ZIP_FILE_PATH = path.join(OutputPath,`${outputId}.zip`);
const readDitaFile = async (filePath) => {
    try {
        return await readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading DITA file (${filePath}): ${error.message}`);
        throw new Error(`Failed to process DITA file: ${filePath}`);
    }
};

const updateDITAMaps = async (filePath) => {
    try {
        await Promise.all([
            updateDITAMapWithNavTitles(filePath),
            updateMainDITAMapWithNavTitles(filePath),
        ]);
    } catch (error) {
        console.error(`Error updating DITA maps for file (${filePath}): ${error.message}`);
        throw new Error(`Failed to update DITA maps for file: ${filePath}`);
    }
};

const modifyDitaContent = (ditaContent) =>
    modifyXmlForBackMatterAndAppendix(ditaContent).replace(/<(appendices|appendix|backmatter)>(.*?)<\/\1>/g, '<topicref>$2</topicref>');


const createZipFromDirectory = async (directoryPath, zipFilePath) => {
    try {
        const zip = new AdmZip();
        zip.addLocalFolder(directoryPath);
        zip.writeZip(zipFilePath);
        console.log(`ZIP file created successfully at ${zipFilePath}`);
    } catch (error) {
        console.error(`Error creating ZIP file: ${error.message}`);
        throw new Error('Failed to create ZIP file.');
    }
};
const processAndSaveDitaFile = async (filePath) => {
    const ditaContent = await readDitaFile(filePath);
    const modifiedContent = modifyDitaContent(ditaContent);
    await writeFile(filePath, modifiedContent, 'utf8');
    await updateDITAMaps(filePath);

};
const processDitaFilesAndZip = async (ditaFiles) => {
    try {
        await mkdir(OutputPath, { recursive: true });
        for (const file of ditaFiles) {
            await processAndSaveDitaFile(file);
        }
        await createZipFromDirectory(TEMP_PROCESSING_DIR, ZIP_FILE_PATH);
        return outputId

    } catch (error) {
        console.error(`Error processing DITA files and creating ZIP: ${error.message}`);
        throw new Error('Failed to process DITA files and create ZIP.');
    }
};

module.exports = processDitaFilesAndZip;


