const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const fileController = require("../controller/fileController");

// router.post("/upload", upload.single("file"), fileController.uploadFile);

router.post("/upload", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
        let message = "Only JPEG, JPG, PNG files are allowed";
        if(err.code === "LIMIT_FILE_SIZE") {
            message = "File size must be less than 2MB";
        }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    fileController.uploadFile(req, res);
  });
});

module.exports = router;