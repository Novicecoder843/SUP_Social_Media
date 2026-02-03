// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads")); // safer path
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpg, png, webp)"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // ✅ 2 MB
  },
  fileFilter
});

module.exports = upload;


