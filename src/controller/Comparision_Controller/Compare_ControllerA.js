const fs = require("fs");
const path = require("path");
const { TagSetA, AttrSetA } = require("../../model/IASBModel/IASB_setA_model"); // Sequelize models
const {
  testTagModel,
  testAttrModel,
} = require("../../model/TestModel/Test_model"); // Sequelize models
const outputId = Math.random().toString(36).substring(7);

const updateLogFile = (newEntries, type, logPath) => {
  if (newEntries.length === 0) {
    console.log(`No new ${type} to log.`);
    return;
  }

  let existingLog = "";
  if (fs.existsSync(logPath)) {
    existingLog = fs.readFileSync(logPath, "utf8");
  }

  const newEntriesToLog = newEntries.filter(
    (entry) => !existingLog.includes(entry)
  );

  if (newEntriesToLog.length > 0) {
    const logContent =
      `************ New ${type} **************\n` +
      newEntriesToLog.join("\n") +
      "\n";
    fs.appendFileSync(logPath, logContent, "utf8");
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

  const logPath = path.join(logFolderPath, "log.txt");
  try {
    const newNames = await compareTags();
    updateLogFile(newNames, "Tags", logPath);
    res.status(200).json({
      message: "Tags comparison completed, check log.txt for results.",
    });
  } catch (error) {
    console.error("Error comparing tags:", error);
    res.status(500).json({ message: "Error comparing tags" });
  }
};

const compareTags = async () => {
  // Use Sequelize query methods instead of Mongoose methods
  const allTagsFrom_SetA = await TagSetA.findAll();
  const allTagsFrom_TestFile = await testTagModel.findAll();

  const namesFrom_SetA = new Set(allTagsFrom_SetA.map((tag) => tag.name));
  const namesFrom_TestFile = allTagsFrom_TestFile.map((tag) => tag.name);

  return namesFrom_TestFile.filter((name) => !namesFrom_SetA.has(name));
};

const getAllAttrSetA = async (req, res) => {
  const { outputId } = req.body.data; // Expect the outputId to be passed in the body of the request
  const logFolderPath = path.join(__dirname, `../../../logOutput/${outputId}`);

  // Ensure the folder exists, create it if it doesn't
  if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath, { recursive: true });
  }

  const logPath = path.join(logFolderPath, "log.txt");
  try {
    const newAttrs = await compareAttributes();
    updateLogFile(newAttrs, "Attributes", logPath);
    res.status(200).json({
      message: "Attributes comparison completed, check log.txt for results.",
    });
  } catch (error) {
    console.error("Error comparing attributes:", error);
    res.status(500).json({ message: "Error comparing attributes" });
  }
};

const compareAttributes = async () => {
  // Use Sequelize query methods instead of Mongoose methods
  const allAttrsFrom_SetA = await AttrSetA.findAll();
  const allAttrsFrom_TestFile = await testAttrModel.findAll();

  const attrNamesFrom_SetA = new Set(
    allAttrsFrom_SetA.map((attr) => attr.name)
  );
  const attrNamesFrom_TestFile = allAttrsFrom_TestFile.map((attr) => attr.name);

  return attrNamesFrom_TestFile.filter((name) => !attrNamesFrom_SetA.has(name));
};

module.exports = { getAllTagsSetA, getAllAttrSetA };
