const pool = require("../db/db");

// CREATE REEL
exports.createReel = async (req, res) => {
  try {
    const { caption, hashtags } = req.body;

const video_url = req.file
  ? `/uploads/reels/${req.file.filename}`
  : null;
    const reel = await pool.query(
      `
      INSERT INTO reels
      (user_id, caption, video_url, hashtags)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        req.user.id,
        caption,
        video_url,
        hashtags
      ]
    );

    res.status(201).json({
      success: true,
      reel: reel.rows[0]
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Create reel failed"
    });
  }
};

// GET ALL REELS
exports.getAllReels = async (req, res) => {
  try {

    const reels = await pool.query(`
      SELECT
        reels.*,
        users.name,
        users.email
      FROM reels
      JOIN users
      ON reels.user_id = users.id
      ORDER BY reels.created_at DESC
    `);

    res.status(200).json({
      success: true,
      reels: reels.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Fetch reels failed"
    });
  }
};
// GET SINGLE REEL
exports.getSingleReel = async (req, res) => {
  try {

    const { id } = req.params;

    const reel = await pool.query(
      `
      SELECT * FROM reels
      WHERE id = $1
      `,
      [id]
    );

    if (reel.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reel not found"
      });
    }

    res.status(200).json({
      success: true,
      reel: reel.rows[0]
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Fetch reel failed"
    });
  }
};

// DELETE REEL
exports.deleteReel = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM reels
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Reel deleted"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete reel failed"
    });
  }
};

// LIKE REEL
exports.likeReel = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      INSERT INTO reel_likes
      (reel_id, user_id)
      VALUES ($1, $2)
      `,
      [id, req.user.id]
    );

    await pool.query(
      `
      UPDATE reels
      SET likes_count = likes_count + 1
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Reel liked"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Like failed"
    });
  }
};

// LIKE COUNT
exports.getLikeCount = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT likes_count FROM reels WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      likes: result.rows[0].likes_count
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
};

// UNLIKE REEL
exports.unlikeReel = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM reel_likes
      WHERE reel_id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Reel not liked yet"
      });
    }

    await pool.query(
      `
      UPDATE reels
      SET likes_count = GREATEST(likes_count - 1, 0)
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Reel unliked"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unlike failed"
    });
  }
};

// COMMENT REEL
exports.commentReel = async (req, res) => {
  try {

    const { id } = req.params;
    const { comment } = req.body;

    await pool.query(
      `
      INSERT INTO reel_comments
      (reel_id, user_id, comment)
      VALUES ($1, $2, $3)
      `,
      [id, req.user.id, comment]
    );

    await pool.query(
      `
      UPDATE reels
      SET comments_count = comments_count + 1
      WHERE id = $1
      `,
      [id]
    );

    res.status(201).json({
      success: true,
      message: "Comment added"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Comment failed"
    });
  }
};
 // COMMENT COUNT
exports.getCommentCount = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT comments_count FROM reels WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      comments: result.rows[0].comments_count
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
};

// SAVE REEL
exports.saveReel = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      INSERT INTO reel_saves
      (reel_id, user_id)
      VALUES ($1, $2)
      `,
      [id, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "Reel saved"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Save failed"
    });
  }
};

// UNSAVE REEL
exports.unsaveReel = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM reel_saves
      WHERE reel_id = $1 AND user_id = $2
      `,
      [id, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "Reel unsaved"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unsave failed"
    });
  }
};

// SHARE REEL
exports.shareReel = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      INSERT INTO reel_shares
      (reel_id, user_id)
      VALUES ($1, $2)
      `,
      [id, req.user.id]
    );

    await pool.query(
      `
      UPDATE reels
      SET shares_count = shares_count + 1
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Reel shared"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Share failed"
    });
  }
};

// SHARE COUNT
exports.getShareCount = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT shares_count FROM reels WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      shares: result.rows[0].shares_count
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
};

// ADD VIEW
exports.addView = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      UPDATE reels
      SET views_count = views_count + 1
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "View counted"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "View failed"
    });
  }
};