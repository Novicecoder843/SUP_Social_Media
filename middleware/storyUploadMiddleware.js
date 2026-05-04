// const multer = require("multer");

// const multerS3 = require("multer-s3");
// const path = require("path");

// const s3 = require ("../config/aws3");

// const upload = multer({
//     storage: multerS3({
//         s3,
//         bucket: process.env.AWS_BUCKET_NAME,
//         contentType : 
//         multerS3.AUTO_CONTENT_TYPE,
//         key:(req,file,cb)=>{
//             const uniqueName = Date.now() + "_" + Math.round(Math.random() * 1e9)+
//             path.extname(file.originalname);
//             cb(null , `stories/${uniqueName}`);
//         }
//     }),
//    fileFilter: (req, file, cb) => {
//     try {
//       // ✅ safety check
//       if (!file || !file.mimetype) {
//         return cb(new Error("Invalid file"), false);
//       }

//       const allowed = /jpeg|jpg|png|mp4|mov|webm/;

//       const ext = allowed.test(
//         path.extname(file.originalname).toLowerCase()
//       );

//       const mime =
//         file.mimetype.startsWith("image/") ||
//         file.mimetype.startsWith("video/");

//       if (ext && mime) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only image/video allowed"), false); // ✅ MUST pass false
//       }
//     } catch (err) {
//       cb(err, false);
//     }
//   },

//   limits: {
//     fileSize: 50 * 1024 * 1024
//   }
// });

// module.exports = upload;

const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const s3 = require("../config/aws3");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        "_" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, `stories/${uniqueName}`); // ✅ correct
    }
  }),

  fileFilter: (req, file, cb) => {
    try {
      // ✅ safety check
      if (!file || !file.mimetype) {
        return cb(new Error("Invalid file"), false);
      }

      const allowed = /jpeg|jpg|png|mp4|mov|webm/;

      const ext = allowed.test(
        path.extname(file.originalname).toLowerCase()
      );

      const mime =
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/");

      if (ext && mime) {
        cb(null, true);
      } else {
        cb(new Error("Only image/video allowed"), false); // ✅ MUST pass false
      }
    } catch (err) {
      cb(err, false);
    }
  },

  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

module.exports = upload;