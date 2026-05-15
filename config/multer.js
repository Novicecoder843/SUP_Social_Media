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
    cb(null, uploadPath); 
  },
filename: (req, file, cb) => {
  const uniqueName = Date.now() + "-" + file.originalname;
  cb(null, uniqueName);
}});

//File filter
const fileFilter = (req, file, cb) => 
  {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/mpeg",
    "video/quicktime"
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExt = [".jpg", ".jpeg", ".png", ".mp4", ".mov", ".mpeg"];

 if(allowedMimeTypes.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }

};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload ;