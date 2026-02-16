const multer = require("multer");
const path = require("path");
const fs = require ("fs");



const profilePath = path.join(__dirname, "uploads/profiles");
const coverPath   = path.join(__dirname, "uploads/covers");

console.log("Profile Path:", profilePath);
console.log("Cover Path:", coverPath);


// create folders if not exist
if (!fs.existsSync(profilePath)) {
  fs.mkdirSync(profilePath, { recursive: true });
}
if (!fs.existsSync(coverPath)) {
  fs.mkdirSync(coverPath, { recursive: true });
}

/* Storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") {
      cb(null, profilePath);
    } else if (file.fieldname === "cover_image") {
      cb(null, coverPath );
    }
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/* File filter */
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = upload;

