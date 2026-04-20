const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../middleware/s3");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentDisposition: "inline",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
  const fileName = Date.now().toString() + "-" + file.originalname;

  const fullPath = `profile-images/${fileName}`;

  cb(null, fullPath);
    }
  }),
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB limit
  }
});

module.exports = upload;