const db = require("../config/db");

// ✅ SINGLE UPLOAD
exports.uploadMedia = async (req, res) => {
  try {
    const { post_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const media_url = req.file.originalname;

    const media_type = req.file.mimetype.startsWith("image")
      ? "image"
      : "video";

    const result = await db.query(
      "INSERT INTO post_media (post_id, media_url, media_type) VALUES ($1,$2,$3) RETURNING *",
      [post_id, media_url, media_type]
    );

    res.json({
      message: "Media uploaded",
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload error" });
  }
};

// ✅ MULTIPLE UPLOAD
exports.uploadMultipleMedia = async (req, res) => {
  try {
    const { post_id } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const mediaList = [];

    for (let file of req.files) {
      const media_url = file.originalname;

      const media_type = file.mimetype.startsWith("image")
        ? "image"
        : "video";

      const result = await db.query(
        "INSERT INTO post_media (post_id, media_url, media_type) VALUES ($1,$2,$3) RETURNING *",
        [post_id, media_url, media_type]
      );

      mediaList.push(result.rows[0]);
    }

    res.json({
      message: "Multiple media uploaded",
      data: mediaList,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload error" });
  }
};

// ✅ GET MEDIA BY POST
exports.getMediaByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await db.query(
      "SELECT * FROM post_media WHERE post_id = $1 ORDER BY created_at DESC",
      [postId]
    );

    res.json({
      message: "Media fetched",
      data: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch error" });
  }
};

// ✅ DELETE MEDIA
exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM post_media WHERE id = $1", [id]);

    res.json({ message: "Media deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete error" });
  }
};