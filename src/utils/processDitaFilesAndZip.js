const path = require('path');
const { writeFile, mkdir } = require('fs/promises');
const modifyXmlForBackMatterAndAppendix = require('../utils/modifyXmlForBackMatterAndAppendix.js');
const OUTPUT_DIR = path.join(__dirname, '../../output');
const TEMP_PROCESSING_DIR = path.join(OUTPUT_DIR, 'TestingFile');
const outputId = Math.random().toString(36).substring(7);
const OutputPath = path.join(OUTPUT_DIR, "downloads", outputId);
const createZipFromDirectory = require("./createZipFromDirectory.js")
const readDitaFile = require("./readDitaFile.js");
const updateDITAMaps = require("./updateDITAMaps.js")
let ZIP_FILE_PATH = path.join(OutputPath, `${outputId}.zip`);
const modifyDitaContent = (ditaContent) =>
    modifyXmlForBackMatterAndAppendix(ditaContent).replace(/<(appendices|appendix|backmatter)>(.*?)<\/\1>/g, '<topicref>$2</topicref>');

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


