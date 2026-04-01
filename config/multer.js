const multer = require("multer");
const path = require("path");
const fs = require("fs");

//Upload path
const uploadPath = path.join(__dirname, "../uploads");

//Ensure folder exists
if(!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true});
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    
  },
});

//File filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const allowedExt = [".jpg", ".jpeg", ".png"];

  const ext = path.extname(file.originalname).toLowerCase();

  if(allowedMimeTypes.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JEPG, JPG, PNG files are allowed"), false);
  }

};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;