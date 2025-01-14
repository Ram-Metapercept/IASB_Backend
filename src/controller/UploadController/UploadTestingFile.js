const fs = require("fs");
const fss = require("fs/promises");
const path = require("path");
const AdmZip = require("adm-zip");
const { promisify } = require("util");
const shell = require("shelljs");

// Promisify fs methods
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const validFileTypes = [".xml", ".dita", ".ditamap"];

const UploadTestingFile = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: false, message: "No files were uploaded." });
  }

  const { file } = req;
  const filename = path.parse(file.originalname).name;
  const testingFileDir = path.join(__dirname, "../../../output", "TestingFile");
  const extractionDir = path.join(testingFileDir, filename);

  try {
    // Clear contents of TestingFile directory, excluding the new extraction directory
    await clearTestingFileDirectory(testingFileDir, extractionDir);

    // Create extraction directory
    await mkdir(extractionDir, { recursive: true });

    // Extract the zip file
    const zip = new AdmZip(file.path);
    zip.extractAllTo(extractionDir, true);

    // Check for valid file formats inside the extracted directory
    const files = await fss.readdir(extractionDir);
    const isValid = files.some((file) =>
      validFileTypes.includes(path.extname(file).toLowerCase())
    );

    if (!isValid) {
      return res.status(400).json({
        status: false,
        message: "No valid .dita, .ditamap, or .xml file found in the ZIP.",
      });
    }

    // Clean up and send success response
    await unlink(file.path);
    res
      .status(200)
      .json({ status: true, message: "File uploaded successfully" });
  } catch (err) {
    console.error("Error during file processing:", err);
    res.status(500).json({ status: false, message: "Error during extraction" });
  }
};
// Helper function to get a list of files in a directory (recursively)
const getFilesInDirectory = async (dirPath) => {
  const fs = require("fs");
  const files = await fs.promises.readdir(dirPath);
  let fileList = [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.promises.stat(fullPath);
    if (stat.isDirectory()) {
      const nestedFiles = await getFilesInDirectory(fullPath); // Recursive call for subdirectories
      fileList = fileList.concat(nestedFiles);
    } else {
      fileList.push(fullPath);
    }
  }

  return fileList;
};

// Function to clear the TestingFile directory except for the specified directory
const clearTestingFileDirectory = async (dirPath, excludeDir) => {
  const items = await readdir(dirPath);
  await Promise.all(
    items.map(async (item) => {
      const itemPath = path.join(dirPath, item);
      if (itemPath === excludeDir) return;

      const itemStat = await stat(itemPath);
      if (itemStat.isDirectory()) {
        shell.rm("-rf", itemPath); // Remove directory
      } else {
        await unlink(itemPath); // Remove file
      }
    })
  );
};

module.exports = UploadTestingFile;
