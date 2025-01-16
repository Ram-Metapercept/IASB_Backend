const path = require("path");
const { writeFile, mkdir, rename } = require("fs/promises");
const modifyXmlForBackMatterAndAppendix = require("../utils/modifyXmlForBackMatterAndAppendix.js");
const OUTPUT_DIR = path.join(__dirname, "../../output");
const TEMP_PROCESSING_DIR = path.join(OUTPUT_DIR, "TestingFile");
const outputId = Math.random().toString(36).substring(7);
const OutputPath = path.join(OUTPUT_DIR, "downloads", outputId);
const createZipFromDirectory = require("./createZipFromDirectory.js");
const readDitaFile = require("./readDitaFile.js");
const updateDITAMaps = require("./updateDITAMaps.js");
let ZIP_FILE_PATH = path.join(OutputPath, `${outputId}.zip`);
const modifyDitaContent = (ditaContent) =>
  modifyXmlForBackMatterAndAppendix(ditaContent);
const replaceDotsWithUnderscore = require("./replaceDotsWithUnderscore.js");

// Asynchronous function to replace all dots in the filename with underscores
const processFileName = async (filePath) => {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const newBaseName = baseName.replace(/\./g, "_");
  return path.join(dir, `${newBaseName}${ext}`);
};

const processAndSaveDitaFile = async (filePath) => {
  const ditaContent = await readDitaFile(filePath);
  const modifiedContent = modifyDitaContent(
    await replaceDotsWithUnderscore(ditaContent)
  );

  // Rename the file
  const newFilePath = await processFileName(filePath);
  if (newFilePath !== filePath) {
    await rename(filePath, newFilePath);
  }
  await writeFile(newFilePath, modifiedContent, "utf8");
  await updateDITAMaps(newFilePath);
};

const processDitaFilesAndZip = async (ditaFiles) => {
  try {
    await mkdir(OutputPath, { recursive: true });
    for (const file of ditaFiles) {
      await processAndSaveDitaFile(file);
    }
    await createZipFromDirectory(TEMP_PROCESSING_DIR, ZIP_FILE_PATH);
    return outputId;
  } catch (error) {
    console.error(
      `Error processing DITA files and creating ZIP: ${error.message}`
    );
    throw new Error("Failed to process DITA files and create ZIP.");
  }
};

module.exports = processDitaFilesAndZip;
