const { Sequelize, DataTypes, Op } = require("sequelize");
const sequelize = require("../../../public/config/db.js"); // Assuming this is your Sequelize instance
const getAllFiles = require("../../utils/getAllFiles");
const path = require("path");
const { execSync } = require("child_process");
const SaxonJS = require("saxon-js");
const fs = require("fs");
const processDitaFilesAndZip = require("../../utils/processDitaFilesAndZip.js");
const runningIASB = require("../../utils/runningIASB.js");
const { promisify } = require("util");
const inputFilePath = path.join(__dirname, "../../../output/TestingFile");
const tagSefPath = path.resolve(
  __dirname,
  "../../../testJsonFiles/test_tag.sef.json"
);

const {
  testTagModel,
  testAttrModel,
} = require("../../model/TestModel/Test_model.js");
const attrSefPath = path.resolve(
  __dirname,
  "../../../testJsonFiles/test_attr.sef.json"
);
const tagStylesheetPath = path.resolve(
  __dirname,
  "../../../public/XSLT_Files/extract_elements.xsl"
);
const attrStylesheetPath = path.resolve(
  __dirname,
  "../../../public/XSLT_Files/extract_attributes.xsl"
);

const MAX_BATCH_SIZE = 500;
const MAX_CONCURRENCY = 5; // Limit concurrent operations
const MAX_FILE_CONCURRENCY = 2; // Limit concurrent file processing
const readFileAsync = promisify(fs.readFile);

// Precompile XSLT files concurrently if not already precompiled
const precompileXSLT = async (xslFilePath, outputFilePath) => {
  if (!fs.existsSync(outputFilePath)) {
    execSync(`xslt3 -t -xsl:${xslFilePath} -export:${outputFilePath} -nogo`);
  }
};

// Asynchronously extract tags/attributes using XSLT
const extractTagsOrAttributes = async (stylesheet, sourceFile) => {
  try {
    const fileContent = await fs.promises.readFile(sourceFile, "utf-8");

    if (!fileContent.trim()) {
      throw new Error(`Source file is empty: ${sourceFile}`);
    }

    const result = SaxonJS.transform({
      stylesheetFileName: stylesheet,
      sourceFileName: sourceFile,
      destination: "serialized",
    }).principalResult;
    if (!result) {
      throw new Error(`Transformation result is empty for file: ${sourceFile}`);
    }
    return (
      result
        .replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, "")
        .match(/<\/?[^>]+>/g) || []
    );
  } catch (error) {
    console.error("Error during transformation:", error);
    return [];
  }
};

// Insert data in bulk efficiently with concurrency control
const insertData = async (dataSet, model) => {
  if (dataSet.size > 0) {
    const dataArray = Array.from(dataSet).map((item) => ({ name: item }));

    // Clear previous data (optional, adjust as necessary)
    await model.destroy({ where: {} });

    // Insert data in batches
    for (let i = 0; i < dataArray.length; i += MAX_BATCH_SIZE) {
      const batch = dataArray.slice(i, i + MAX_BATCH_SIZE);
      await model.bulkCreate(batch, { ignoreDuplicates: true });
    }
  }
};

// Process files in smaller chunks to prevent too many open files error
const processFilesInChunks = async (files, processFileFunction) => {
  const chunks = [];
  for (let i = 0; i < files.length; i += MAX_FILE_CONCURRENCY) {
    chunks.push(files.slice(i, i + MAX_FILE_CONCURRENCY));
  }
  for (const chunk of chunks) {
    await Promise.all(chunk.map((file) => processFileFunction(file)));
  }
};

// Main controller
const TestingFileController = async (req, res) => {
  try {
    const allowedExtensions = [".xml", ".dita", ".ditamap"];

    // Get all DITA files asynchronously
    const ditaFiles = getAllFiles(inputFilePath).filter((file) =>
      allowedExtensions.some((ext) => file.endsWith(ext))
    );

    // Precompile XSLT files concurrently
    await Promise.all([
      precompileXSLT(tagStylesheetPath, tagSefPath),
      precompileXSLT(attrStylesheetPath, attrSefPath),
    ]);

    const uniqueTags = new Set();
    const uniqueAttributes = new Set();

    // Process DITA files in smaller chunks to limit open file descriptors
    await processFilesInChunks(ditaFiles, async (ditaFile) => {
      const absFilePath = path.resolve(inputFilePath, ditaFile);
      const [tags, attrs] = await Promise.all([
        extractTagsOrAttributes(tagSefPath, absFilePath),
        extractTagsOrAttributes(attrSefPath, absFilePath),
      ]);
      tags.forEach((tag) => uniqueTags.add(tag));
      attrs.forEach((attr) => uniqueAttributes.add(attr));
    });

    // Insert the data concurrently
    await Promise.all([
      insertData(uniqueTags, testTagModel),
      insertData(uniqueAttributes, testAttrModel),
    ]);

    await runningIASB(ditaFiles, inputFilePath);
    const outputId = await processDitaFilesAndZip(ditaFiles);

    return res.status(200).json({
      status: "success",
      statusCode: "200",
      message: "Successfully inserted into database",
      outputId,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = TestingFileController;
