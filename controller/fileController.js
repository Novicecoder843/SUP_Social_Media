const fileModel = require("../models/fileModel");

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false, message: "No file uploaded",
            });
        }

// Save file info in DB
const savedFile = await fileModel.saveFile(req.file);

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

