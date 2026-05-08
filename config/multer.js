const multer = require("multer");
const path = require("path");

// storage setup (🔥 main fix)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter (same tumhara)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/mkv",
    "video/quicktime"
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExt = [
    ".jpg",
    ".jpeg",
    ".png",
    ".mp4",
    ".mkv",
    ".mov"
  ];

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExt.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Image & Video files allowed"), false);
  }
};

// multer config
const upload = multer({
  storage, // 🔥 change here
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = upload;