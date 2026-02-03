const multer = require("multer");
const path = require("path");

/* Storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") {
      cb(null, "uploads/profiles");
    } else if (file.fieldname === "cover_image") {
      cb(null, "uploads/covers");
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


// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const ensureDir = (dirPath) => {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadPath = "uploads";

//     if (file.fieldname === "profile_image") {
//       uploadPath = "uploads/profiles";
//     } else if (file.fieldname === "cover_image") {
//       uploadPath = "uploads/covers";
//     }

//     ensureDir(uploadPath); // 👈 CREATE FOLDER IF NOT EXISTS
//     cb(null, uploadPath);
//   },

//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;
