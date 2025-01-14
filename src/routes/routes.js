const express = require("express");
const router = express.Router();
const uploadTestingFile = require("../controller/UploadController/UploadTestingFile.js");
const {
  getAllTagsSetA,
  getAllAttrSetA,
} = require("../controller/Comparision_Controller/Compare_ControllerA.js");
const {
  getAllTagSetB,
  getAllAttributeSetB,
} = require("../controller/Comparision_Controller/Compare_ControllerB.js");
const {
  getAllTagSetC,
  getAllAttributeSetC,
} = require("../controller/Comparision_Controller/Compare_ControllerC.Js");
const TestingFilesController = require("../controller/TestingFileController/TestingFileController.js");
const IASB_setA_controller_Tags = require("../controller/IASBController/IASB_setA_controller.js");
const IASB_setB_controller_Tags = require("../controller/IASBController/IASB_setB_controller.js");
const IASB_setC_controller_Tags = require("../controller/IASBController/IASB_setC_controller.js");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const shell = require("shelljs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../output/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("file"), uploadTestingFile);
router.post("/testingFile", TestingFilesController);

router.post("/compareTagTestingFileA", getAllTagsSetA);
router.post("/compareAttrTestingFileA", getAllAttrSetA);

router.post("/compareTagTestingFileB", getAllTagSetB);
router.post("/compareAttrTestingFileB", getAllAttributeSetB);

router.post("/compareTagTestingFileC", getAllTagSetC);
router.post("/compareAttrTestingFileC", getAllAttributeSetC);

router.post("/addTagAttrToDatabaseSetA", IASB_setA_controller_Tags);
router.post("/addTagAttrToDatabaseSetB", IASB_setB_controller_Tags);
router.post("/addTagAttrToDatabaseSetC", IASB_setC_controller_Tags);

router.get("/addTagAttrToDatabaseSetA", IASB_setA_controller_Tags);
router.get("/addTagAttrToDatabaseSetB", IASB_setB_controller_Tags);
router.get("/addTagAttrToDatabaseSetC", IASB_setC_controller_Tags);

router.get("/download/:downloadId", async (req, res) => {
  const downloadId = req.params.downloadId;

  let fileName = `${downloadId}.zip`;
  const FILE_PATH = path.join(
    __dirname,
    "../../output/downloads",
    downloadId,
    fileName
  );

  const DOWNLOADS_FOLDER = path.join(__dirname, "../../output/downloads");

  res.download(FILE_PATH, fileName, async (err) => {
    if (err) {
      return res.status(500).send("Download error");
    }

    res.on("finish", async () => {
      try {
        await cleanupDownloadsFolder(DOWNLOADS_FOLDER);
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    });
  });
});

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

router.get("/logDownload/:logdownloadId", (req, res) => {
  const downloadId = req.params.logdownloadId;
  let fileName = "log.txt";
  const FILE_PATH = path.join(
    __dirname,
    "../../logOutput",
    downloadId,
    fileName
  );

  const DOWNLOADS_FOLDER = path.join(__dirname, "../../logOutput");

  res.download(FILE_PATH, fileName, async (err) => {
    if (err) {
      return res.status(500).send("Download error");
    }

    res.on("finish", async () => {
      try {
        await cleanupDownloadsFolder(DOWNLOADS_FOLDER);
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    });
  });
});

module.exports = router;
