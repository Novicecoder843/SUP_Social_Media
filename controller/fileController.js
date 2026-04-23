const fileModel = require("../models/fileModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.log("File size:", req.file.size);
        }

        if (!req.file) {
            return res.status(400).json({
                success: false, message: "Only image files (jpeg, jpg, png) are allowed",
            });
        }
      
       console.log("Original file size:", req.file.size);

       // Ensure uploads folder exists
        if (!fs.existsSync("uploads")) {
            fs.mkdirSync("uploads");
        }

    //Create filename like 19042026-1302.png
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const fileName = `${day}${month}${year}-${hours}${minutes}.png`;
    
    const filePath = "uploads/" + req. file. filename;


       
// New file path
const newFileName = Date.now() + ".png";
console.log("New File Name:", newFileName);
const newFilePath = path.join("uploads", newFileName);

//Convert image format
await sharp(req.file.path)
.png()
.toFile(newFilePath);

//Delete original file
fs.unlinkSync(req.file.path);

// Update file object before saving to DB
const baseUrl =
`${req.protocol}://${req.get("host")}`;
const fullUrl = `${baseUrl}/${newFilePath}`;

const updateFile =  {
    filename: newFileName,
    path: fullUrl,
    mimetype: "image/png",
    size: req.file.size,
};

console.log("FULL URL:", fullUrl);
console.log("UPDATE OBJECT:",updateFile);

// Save file info in DB
const savedFile = await fileModel.saveFile(updateFile);

// const baseUrl =
// `${req.protocol}://${req.get("host")}`;
// const fullUrl = `${baseUrl}/${newFilePath}`;

res.status(201).json({
    success: true, message: "File uploaded & saved to DB",
    profile_image: fullUrl, 
    data: savedFile,
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false, message: "Server error",
        });
    }
};