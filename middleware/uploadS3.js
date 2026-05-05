const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

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
        // const fileName = file.originalname;
        console.log("DEBUG KEY FUNCTION RUNNING"); 
        console.log("Uploading file:", file.originalname);

        const ext = path.extname(file.originalname);

        const uniqueName = Date.now() + "-" + Math.floor(Math.random() + 1000)

        ext;

        cb(null, `Upload-images/${uniqueName}`);
      },
    }),

    fileFilter: (req, file, cb) => {
      console.log("File type:", file.mimetype);

      if( 
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video")
      ) {  
        cb(null, true);
      } else {
        console.log("Skipped file:", file.mimetype);
        cb(null, false);
        // cb(new Error("Only images  & video allowed"), false);
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