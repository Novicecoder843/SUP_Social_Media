const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const fileController = require("../controller/fileController");

router.post("/upload", upload.single("file"), fileController.uploadFile);

module.exports = router;