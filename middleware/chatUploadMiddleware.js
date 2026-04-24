const multer = require("multer");
const path = require("path");
const fs = require("fs");

const mediaPath = "uploads/chat";

if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {

  const allowed =
    /jpeg|jpg|png|mp4|webm|mov/;

  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime =
    file.mimetype.startsWith("image/")
    ||
    file.mimetype.startsWith("video/");

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

module.exports = upload;