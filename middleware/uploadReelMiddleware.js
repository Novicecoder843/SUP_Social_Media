const multer = require("multer")
const multerS3 = require("multer-s3");
const path = require("path");

const s3 = require("../config/aws3");

const upload = multer({

    storage: multerS3({

        s3,

        bucket: process.env.AWS_BUCKET_NAME,

        contentType: multerS3.AUTO_CONTENT_TYPE,

        metadata: (
            req,
            file,
            cb
        ) => {

            cb(null, {
                fieldName: file.fieldname
            });

        },

        key: (
            req,
            file,
            cb
        ) => {

            const ext =
                path.extname(
                    file.originalname
                );

            cb(
                null,
                `reels/videos/${req.user.id}/${Date.now()}${ext}`
            );

        }

    }),

    fileFilter: (
        req,
        file,
        cb
    ) => {

        if (
            file.mimetype.startsWith("video/")
        ) {

            cb(null, true);

        } else {

            cb(
                new Error("Only video allowed"),
                false
            );

        }

    }

});


module.exports = upload;