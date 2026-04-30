const mediaModel = require("../models/mediaModel");

const db = require("../config/db");
const s3 = require("../config/s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

exports.uploadMedia = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const { post_id } = req.body;

    // 1️⃣ Check file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 2️⃣ Check post_id
    if (!post_id) {
      return res.status(400).json({ message: "post_id is required" });
    }

    // 3️⃣ Validate post exists
    const postExists = await mediaModel.checkPostExists(post_id);
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 4️⃣ Create file name
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // 5️⃣ Upload to AWS S3
    await s3.send(
      new PutObjectCommand({
        Bucket: "lagna-222",
        Key: `images/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    // 6️⃣ AWS URL
    const media_url = `https://lagna-222.s3.ap-south-1.amazonaws.com/images/${fileName}`;

    // 7️⃣ Detect media type
    const media_type = req.file.mimetype.startsWith("image")
      ? "image"
      : "video";

    // 8️⃣ Save to DB
    const media = await mediaModel.createMedia({
      post_id,
      media_url,
      media_type,
    });

    return res.status(200).json({
      message: "Media uploaded successfully",
      media,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return res.status(500).json({
      message: "Error uploading media",
      error: err.message,
    });
  }
};

exports.getMediaByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM post_media WHERE post_id = $1 ORDER BY created_at DESC",
      [postId]
    );

    res.status(200).json({
      message: "Media fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching media",
    });
  }
};

exports.deleteMedia = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if media exists
    const media = await db.query(
      "SELECT * FROM post_media WHERE id = $1",
      [id]
    );

    if (media.rows.length === 0) {
      return res.status(404).json({ message: "Media not found" });
    }

    await db.query("DELETE FROM post_media WHERE id = $1", [id]);

    res.status(200).json({
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting media",
    });
  }
};