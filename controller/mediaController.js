const mediaModel = require("../models/mediaModel");

exports.uploadMedia = async (req, res) => {
  try {
    const { post_id } = req.body;
console.log(req.body)
    // 1. Validate file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!post_id) {
  return res.status(400).json({ message: "post_id required" });
  }

    // 2. Validate post
    const postExists = await mediaModel.checkPostExists(post_id);
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 3. Generate URL
    const media_url = req.file.key;
    // 4. Detect type
    const media_type = req.file.mimetype.startsWith("image")
      ? "image"
      : "video";

    // 5. Save in DB
    const media = await mediaModel.createMedia({
      post_id,
      media_url,
      media_type,
    });

    res.json({
      message: "Media uploaded successfully",
      media,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading media" });
  }
};