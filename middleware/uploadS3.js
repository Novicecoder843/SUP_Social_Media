// const AWS = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const upload = require("../config/multer");

// try {
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// console.log("AWS S3 initialized");

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET_NAME,
//     acl: "public-read",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const fileName = Date.now() + "-" + file.originalname;
//       console.log("Uploading file:", fileName);
//       cb(null, fileName);
//     },
//   }),
  
//   fileFilter: (req, file, cb) => {
//     console.log("File type:", file.mimetype);

//     if (file.mimetype.startsWith("image")) {
//        cb(null, true);
//    } else { 
//     cb(new Error("Only images allowed"), false);
//    }
//   },
//   limits: { fileSize: 5 * 1024 * 1024}, 
// });

// module.exports = upload;

// } catch (error) {
//   console.log("AWS Upload Init Error:", error);
//   throw error;
// }
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

try {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // console.log("AWS S3 v3 initialized");

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      // acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,

      key: (req, file, cb) => {
        const fileName = file.originalname;
        console.log("DEBUG KEY FUNCTION RUNNING"); 
        console.log("Uploading file:", fileName);
        cb(null,  Date.now() + "-" + file.originalname);
      },
    }),

    fileFilter: (req, file, cb) => {
      console.log("File type:", file.mimetype);

      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(new Error("Only images allowed"), false);
      }
    },

    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  module.exports = upload;

} catch (error) {
  console.log("AWS Upload Init Error:", error);
  throw error;
}