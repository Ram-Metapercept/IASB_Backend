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

const validFileTypes = [".dita", ".ditamap"];

const scanFilesRecursively = async (dir) => {
  let files = await readdir(dir, { withFileTypes: true });
  for (let file of files) {
    let fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      const nestedValid = await scanFilesRecursively(fullPath);
      if (nestedValid) return true;
    } else if (validFileTypes.includes(path.extname(file.name).toLowerCase())) {
      return true;
    }
  }
  return false;
};

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

    // Check for valid file formats recursively in the extracted directory
    const isValid = await scanFilesRecursively(extractionDir);

    if (!isValid) {
      return res.status(400).json({
        status: false,
        message: "No valid .dita or .ditamap file found in the ZIP.",
      });
    }

    // Clean up and send success response
    await unlink(file.path);
    res
      .status(200)
      .json({ status: true, message: "File uploaded successfully" });
  } catch (err) {
    console.error("Error during file processing:", err);
    if (file && file.path) {
      try {
        await unlink(file.path);
      } catch (cleanupErr) {
        console.error("Error during cleanup:", cleanupErr);
      }
    }
    res.status(500).json({ status: false, message: "Error during extraction" });
  }
};

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