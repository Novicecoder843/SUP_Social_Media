const multer = require("multer");
const path = require("path");
const fs = require("fs");

// CREATE uploads/reels FOLDER IF NOT EXISTS
const uploadPath = "uploads/reels";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// STORAGE
const storage = multer.diskStorage({

  // DESTINATION
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  // FILE NAME
  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9);

    cb(
      null,
      uniqueName +
      path.extname(file.originalname)
    );
  }
});

// FILE FILTER
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files allowed"), false);
  }
};

// UPLOAD
const reelUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024
  }
});

module.exports = reelUpload;