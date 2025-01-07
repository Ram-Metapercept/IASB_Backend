const { testTagModel, testAttrModel } = require("../../model/TestModel/Test_model.js");
const getAllFiles = require("../../utils/getAllFiles");
const path = require("path");
const { execSync } = require("child_process");
const SaxonJS = require("saxon-js");
const fs = require('fs');
const os = require('os');
const processDitaFilesAndZip = require("../../utils/processDitaFilesAndZip.js");
const runningIASB = require("../../utils/runningIASB.js");
const { promisify } = require("util")
const inputFilePath = path.join(__dirname, "../../../output/TestingFile");
const tagSefPath = path.resolve(__dirname, "../../../testJsonFiles/test_tag.sef.json");
const attrSefPath = path.resolve(__dirname, "../../../testJsonFiles/test_attr.sef.json");
const tagStylesheetPath = path.resolve(__dirname, "../../../public/XSLT_Files/extract_elements.xsl");
const attrStylesheetPath = path.resolve(__dirname, "../../../public/XSLT_Files/extract_attributes.xsl");

const MAX_BATCH_SIZE = 500;
const MAX_CONCURRENCY = 5;  // Limit concurrent operations
const MAX_FILE_CONCURRENCY = 2;  // Limit concurrent file processing
readFileAsync=promisify(fs.readFile)
// Precompile XSLT files concurrently if not already precompiled
const precompileXSLT = async (xslFilePath, outputFilePath) => {
  if (!fs.existsSync(outputFilePath)) {
    execSync(`xslt3 -t -xsl:${xslFilePath} -export:${outputFilePath} -nogo`);
  }
};


// Asynchronously extract tags/attributes using XSLT
const extractTagsOrAttributes = async (stylesheet, sourceFile) => {
  try {

    const fileContent = await fs.promises.readFile(sourceFile, 'utf-8');

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

    return result.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/g, "").match(/<\/?[^>]+>/g) || [];
  } catch (error) {
    console.error("Error during transformation:", error);
    return [];
  }
};

// Build bulk operations for database insertion
const buildBulkOperations = (dataSet, model) => {
  return Array.from(dataSet).map(item => ({
    updateOne: {
      filter: { name: item },
      update: { $setOnInsert: { name: item } },
      upsert: true,
    },
  }));
};

// Insert data in bulk efficiently with concurrency control
const insertData = async (operations, model) => {
  if (operations.length > 0) {
    const processChunks = [];
    for (let i = 0; i < operations.length; i += MAX_BATCH_SIZE) {
      const chunk = operations.slice(i, i + MAX_BATCH_SIZE);
      processChunks.push(model.bulkWrite(chunk));
    }

    // Execute multiple insert operations in parallel, controlling concurrency
    const concurrencyLimit = MAX_CONCURRENCY;
    const chunksPerBatch = Math.ceil(processChunks.length / concurrencyLimit);
    const concurrencyChunks = [];

    for (let i = 0; i < concurrencyLimit; i++) {
      const batch = processChunks.slice(i * chunksPerBatch, (i + 1) * chunksPerBatch);
      concurrencyChunks.push(Promise.all(batch));
    }

    await Promise.all(concurrencyChunks);
  }
};

// Process files in smaller chunks to prevent too many open files error
const processFilesInChunks = async (files, processFileFunction) => {
  const chunks = [];
  for (let i = 0; i < files.length; i += MAX_FILE_CONCURRENCY) {
    chunks.push(files.slice(i, i + MAX_FILE_CONCURRENCY));
  }

  console.log

  for (const chunk of chunks) {
    await Promise.all(chunk.map(file => processFileFunction(file)));
  }
};

// Main controller
const TestingFileController = async (req, res) => {
  try {
    const allowedExtensions = [".xml", ".dita", ".ditamap"];

    // Get all DITA files asynchronously
    const ditaFiles = getAllFiles(inputFilePath).filter(file =>
      allowedExtensions.some(ext => file.endsWith(ext))
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

      tags.forEach(tag => uniqueTags.add(tag));
      attrs.forEach(attr => uniqueAttributes.add(attr));
    });


    await runningIASB(ditaFiles, inputFilePath);

    const outputId = await processDitaFilesAndZip(ditaFiles);

    // Build bulk operations for tags and attributes concurrently
    const [tagOperations, attrOperations] = await Promise.all([
      buildBulkOperations(uniqueTags, testTagModel),
      buildBulkOperations(uniqueAttributes, testAttrModel),
    ]);

    // Insert the data concurrently, ensuring proper concurrency control
    await Promise.all([
      insertData(tagOperations, testTagModel),
      insertData(attrOperations, testAttrModel),
    ]);

    return res.status(200).json({
      status: "success",
      statusCode: "200",
      message: "Successfully inserted into database",
      outputId
    });

  } catch (error) {
    console.error("Error in TestingFileController:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

module.exports = TestingFileController;
