const multer = require("multer");
const path = require("path");

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg"
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    [".jpg", ".jpeg", ".png"].includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG files allowed"), false);
  }
};

// Multer config using memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;