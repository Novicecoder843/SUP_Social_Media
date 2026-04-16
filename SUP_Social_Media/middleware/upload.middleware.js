// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype.startsWith('image') ||
//     file.mimetype.startsWith('video')
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image and video allowed'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 50 * 1024 * 1024 } // 50MB
// });
// // const upload = multer({ storage });
// module.exports = upload;
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');

// ✅ file filter (same as before)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image') ||
    file.mimetype.startsWith('video')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video allowed'), false);
  }
};

// ✅ S3 storage
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,

  key: (req, file, cb) => {
    const userId = req.user?.id || 'guest';
    const fileName = Date.now() + '-' + file.originalname;

    // 🔥 folder structure in S3
    cb(null, `posts/${userId}/${fileName}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;