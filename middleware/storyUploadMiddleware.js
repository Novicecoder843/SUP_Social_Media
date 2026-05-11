

// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const path = require("path");

// const s3 = require("../config/aws3");

// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.AWS_BUCKET_NAME,

//     contentType: multerS3.AUTO_CONTENT_TYPE,
//      metadata: (req, file, cb) => {

//             cb(null, {
//                 fieldName: file.fieldname
//             });

//         },

//     key: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const folder =
//         file.mimetype.startsWith("video")
//           ? "videos"
//           : "images";
//       cb(
//         null,
//         `stories/${folder}/${req.user.id}/${Date.now()}${ext}`
//       );
//       //   const uniqueName =
//       //     Date.now() +
//       //     "_" +
//       //     Math.round(Math.random() * 1e9) +
//       //     path.extname(file.originalname);

//       //   cb(null, `stories/${uniqueName}`); // ✅ correct
//       // }
//     },

//   fileFilter: (req, file, cb) => {
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


// ALLOWED FILE TYPES
const allowedMimeTypes = [

    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",

    "video/mp4",
    "video/mov",
    "video/quicktime"

];


// MULTER S3 CONFIG
const upload = multer({

    storage: multerS3({

        s3: s3,

        bucket: process.env.AWS_BUCKET_NAME,

        contentType: multerS3.AUTO_CONTENT_TYPE,

        metadata: (req, file, cb) => {

            cb(null, {
                fieldName: file.fieldname
            });

        },


        key: (req, file, cb) => {

            try {

                // FILE EXTENSION
                const ext = path.extname(file.originalname);

                // CHECK FILE TYPE
                const folder =
                    file.mimetype.startsWith("video/")
                        ? "videos"
                        : "images";

                // UNIQUE FILE NAME
                const fileName =
                    `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

                // FINAL S3 FILE PATH
                const filePath =
                    `stories/${folder}/${req.user.id}/${fileName}`;

                console.log("S3 FILE PATH:", filePath);

                cb(null, filePath);

            } catch (err) {

                cb(err);

            }

        }

    }),


    // FILE SIZE LIMIT
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    },


    // FILE FILTER
    fileFilter: (req, file, cb) => {

        console.log("FILE MIME TYPE:", file.mimetype);

        if (allowedMimeTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error("Unsupported file type"),
                false
            );

        }

    }

});


module.exports = upload;