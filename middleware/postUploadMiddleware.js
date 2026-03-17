const multer = require("multer");
const path = require("path");
const fs = require ("fs");



const profilePath =  "uploads/posts"

console.log("Profile Path:", profilePath);


// create folders if not exist
if (!fs.existsSync(profilePath)) {
  fs.mkdirSync(profilePath, { recursive: true });
}


/* Storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/* File filter */
const fileFilter = (req, file, cb) => {
  const allowed =  /jpeg|jpg|png|mp4|mov/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error("Only images/ videos are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
}).array("media", 5); // max 5 files;

module.exports = upload;



