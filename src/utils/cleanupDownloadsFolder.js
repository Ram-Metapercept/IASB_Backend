const fs = require("fs");

const path = require("path");

const { promisify } = require("util");
const shell = require("shelljs");

async function cleanupDownloadsFolder(folderDir) {
  try {
    if (fs.existsSync(folderDir)) {
      shell.rm("-rf", path.join(folderDir, "*"));
      console.log(
        "Successfully cleaned up contents inside the downloads folder:",
        folderDir
      );
    } else {
      console.log("Directory does not exist:", folderDir);
    }
  } catch (error) {
    console.error(
      "Error cleaning up contents inside the downloads folder:",
      error
    );
  }
}


module.exports=cleanupDownloadsFolder