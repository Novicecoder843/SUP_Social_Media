const fileModel = require("../models/fileModel");
// const sharp = require("sharp");

exports.uploadFile = async (req, res) => {
    try {
        if (req.file) {
            console.log("File size:", req.file.size);
        }

        if (!req.file) {
            return res.status(400).json({
                success: false, message: "Only image files (jpeg, jpg, png) are allowed",
            });
        }
      
       console.log("Original file size:", req.file.size);
       
       console.log("Uploaded file:", req.file);
// New file path
const newFileName = Data.now() + "-" + req.file.originalname;
const newFilePath = Path.join("uploads", newFileName);

// //Convert image format
// await sharp(req.file.path)
// .png()
// .toFile(newFilePath);

//Delete original file
const fs = require("fs");
// fs.unlinkSync(req.file.path);

// //Update file object before saving to DB
// const updateFile =  {
//     filename: newFileName,
//     path: newFilePath,
//     mimetype: "image/png",
//     size: req.file.size,
// };
const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3
.${process.env.AWS_REGION}.amazonaws.com/
${req.file.key}`;

const fileData = {
      filename: req.file.originalname,
      s3_filename: req.file.key,
      url: req.file.location, // ✅ S3 URL
      mimetype: req.file.mimetype,
      size: req.file.size,
    };
    console.log(process.env.S3_BASE_URL);
// Save file info in DB
const savedFile = await fileModel.saveFile(fileData);

res.status(201).json({
    success: true, message: "File uploaded & saved to DB", data: savedFile,
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false, message: "Server error",
        });
    }
};

