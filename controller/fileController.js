const fileModel = require("../models/fileModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

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

       if (!fs.existsSync("uploads")) {
          fs.mkdirSync("uploads");
       }
       
// New file path
const newFileName = Date.now() + ".png";
console.log("New File Name:", newFileName);
const newFilePath = path.join("uploads", newFileName);

// //Convert image format
// await sharp(req.file.path)
// .png()
// .toFile(newFilePath);

// //Delete original file
// const fs = require("fs");
// fs.unlinkSync(req.file.path);

// //Update file object before saving to DB
const updateFile =  {
    filename: newFileName,
    path: newFilePath,
    mimetype: "image/png",
    size: req.file.size,
};

// Save file info in DB
const savedFile = await fileModel.saveFile(updateFile);

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