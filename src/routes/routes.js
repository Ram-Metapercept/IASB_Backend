const express= require('express')
const router=express.Router()
const uploadTestingFile = require("../controller/uploadController/uploadTestingFile.js")
const {getAllTagsSetA,getAllAttrSetA}=require("../controller/Comparision_Controller/Compare_ControllerA.js")
const {getAllTagSetB, getAllAttributeSetB}=require("../controller/Comparision_Controller/Compare_ControllerB.js")
const {getAllTagSetC, getAllAttributeSetC}=require("../controller/Comparision_Controller/Compare_ControllerC.Js")
const TestingFilesController=require("../controller/TestingFileController/TestingFileController.js")
const IASB_setA_controller_Tags=require("../controller/IASBController/IASB_setA_controller.js")
const IASB_setB_controller_Tags=require("../controller/IASBController/IASB_setB_controller.js")
const IASB_setC_controller_Tags=require("../controller/IASBController/IASB_setC_controller.js")
const path=require("path")
const multer = require('multer');
const { getInputFileName } = require('../stateManagement/state.js')
const {promisify} = require('util');
const fs = require('fs');
const shell=require('shelljs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../output/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ dest: 'uploads/' });
router.post("/api/upload",upload.single('file'),uploadTestingFile)
router.post("/api/testingFile",TestingFilesController)

router.post("/api/compareTagTestingFileA",getAllTagsSetA)
router.post("/api/compareAttrTestingFileA",getAllAttrSetA)

router.post("/api/compareTagTestingFileB",getAllTagSetB)
router.post("/api/compareAttrTestingFileB",getAllAttributeSetB)

router.post("/api/compareTagTestingFileC",getAllTagSetC)
router.post("/api/compareAttrTestingFileC",getAllAttributeSetC)

router.post("/api/addTagAttrToDatabaseSetA",IASB_setA_controller_Tags)
router.post("/api/addTagAttrToDatabaseSetB",IASB_setB_controller_Tags)
router.post("/api/addTagAttrToDatabaseSetC",IASB_setC_controller_Tags)

router.get("/api/addTagAttrToDatabaseSetA",IASB_setA_controller_Tags)
router.get("/api/addTagAttrToDatabaseSetB",IASB_setB_controller_Tags)
router.get("/api/addTagAttrToDatabaseSetC",IASB_setC_controller_Tags)

const Log_FILE_PATH = path.join(__dirname,"../../log.txt")
router.get('/api/download/:downloadId', async (req, res) => {
  const downloadId = req.params.downloadId;

  fileName = `${downloadId}.zip`;
  const FILE_PATH = path.join(__dirname, '../../output/downloads', downloadId, fileName);

  const DOWNLOADS_FOLDER = path.join(__dirname, '../../output/downloads');

  res.download(FILE_PATH, fileName, async (err) => {
    if (err) {
      return res.status(500).send('Download error');
    }

    res.on('finish', async () => {
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

      shell.rm('-rf', path.join(folderDir, '*')); 
      console.log("Successfully cleaned up contents inside the downloads folder:", folderDir);
    } else {
      console.log("Directory does not exist:", folderDir);
    }
  } catch (error) {
    console.error("Error cleaning up contents inside the downloads folder:", error);
  }
}


// router.get('/api/logDownload', (req, res) => {
//     res.download(Log_FILE_PATH, 'log.txt', (err) => {
//         if (err) {
//             console.error('Error occurred while sending the file:', err);
//             return res.status(500).send('Error downloading file');
//         }
//         console.log('File downloaded successfully');
//     });
// });

router.get('/api/logDownload', (req, res) => {
    res.download(Log_FILE_PATH, 'log.txt', (err) => {
      if (err) {
        console.error('Error occurred while sending the file:', err);
        return res.status(500).send('Error downloading file');
      }
      console.log('File downloaded successfully');
  
      // Delete the log file after successful download
      fs.unlink(Log_FILE_PATH, (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting log file:', deleteErr);
        } else {
          console.log('Log file deleted successfully');
        }
      });
    });
  });


module.exports = router;


