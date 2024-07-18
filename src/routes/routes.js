const express= require('express')
const router=express.Router()
const UploadFiles = require("../controller/uploadController/UploadIASB")
const IASB_setA_controller_Tags=require("../controller/IASBController/Tags/IASB_setA_controller")
const IASB_setB_controller_Tags=require("../controller/IASBController/Tags/IASB_setB_controller")
const IASB_setC_controller_Tags=require("../controller/IASBController/Tags/IASB_setC_controller")



const IASB_setA_controller_Attr=require("../controller/IASBController/Attributes/IASB_setA_controller")
const IASB_setB_controller_Attr=require("../controller/IASBController/Attributes/IASB_setB_controller")
const IASB_setC_controller_Attr=require("../controller/IASBController/Attributes/IASB_setC_controller")
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../output/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
router.post("/api/upload",upload.single('file'),UploadFiles)
router.post("/api/addTagToDatabaseSetA",IASB_setA_controller_Tags)
router.post("/api/addTagToDatabaseSetB",IASB_setB_controller_Tags)
router.post("/api/addTagToDatabaseSetC",IASB_setC_controller_Tags)

router.get("/api/addTagToDatabaseSetA",IASB_setA_controller_Tags)
router.get("/api/addTagToDatabaseSetB",IASB_setB_controller_Tags)
router.get("/api/addTagToDatabaseSetC",IASB_setC_controller_Tags)

router.post("/api/addAttrToDatabaseSetA",IASB_setA_controller_Attr)
router.post("/api/addAttrToDatabaseSetB",IASB_setB_controller_Attr)
router.post("/api/addAttrToDatabaseSetC",IASB_setC_controller_Attr)

module.exports = router
