const pool = require("../config/db");
const db = require("../config/db");
const commentModel = require("../models/commentModel");

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.id;
    const comment_text = req.body;

    const result = await pool.query(
      "INSERT INTO comments (user_id, post_id, comment_text) VALUES ($1,$2,$3) RETURNING *",
      [user_id, post_id, comment_text]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

//ADD REPLY
exports.addReply = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      postId: post_id,
      comment: content,
      parent_Id: parent_id
    } = req.body;

    if (!post_id || !content) {
      return res.status(400).json({
        message: "post_id and content are required"
      });
    }

    const result = await commentModel.addReply(
      post_id, user_id, content, parent_id
    );

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding reply"});
  }
};
// exports.addReply = async (req, res) => {
//   try{
//     const user_id = req.user.id;
//     const { post_id, content, parent_id } = req.body;
    
//     const result = await commentModel.addReply(
//       post_id, user_id, content, parent_id
//     );

//     res.json({ success: true, data: result.rows[0] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error adding reply"});
//   }
// };

// GET COMMENTS + NESTED
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId; 

    console.log("POST ID:", postId); 
    const result = await commentModel.getCommentsWithReplies(postId);

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments"
    });
  }
};
// exports.getComments = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const result = await commentModel.getCommentsWithReplies(postId);

//     // 🔥 NESTING LOGIC
//     const comments = [];
//     const map = {};

//     result.rows.forEach((c) => {
//       c.replies = [];
//       map[c.id] = c;

//       if (!c.parent_id) {
//         comments.push(c);
//       } else {
//         map[c.parent_id]?.replies.push(c);
//       }
//     });

//     res.json({ success: true, data: comments });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching comments" });
//   }
// };
// // GET COMMENTS
// exports.getComments = async (req, res) => {
//   const result = await pool.query(
//     "SELECT * FROM comments WHERE post_id=$1 ORDER BY created_at DESC",
//     [req.params.id]
//   );
//   res.json(result.rows);
// };

// UPDATE COMMENT 
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment_text } = req.body;

  try {
    // Check if comment exists
    const existing = await db.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // // OPTIONAL: Check ownership (VERY IMPORTANT 🔐)
    // if (existing.rows[0].user_id !== req.user.userId) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const result = await db.query(
      "UPDATE comments SET comment_text = $1 WHERE id = $2 RETURNING *",
      [comment_text, commentId]
    );

    res.status(200).json({
      message: "Comment updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating comment",
    });
  }
};

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  await pool.query("DELETE FROM comments WHERE id=$1", [req.params.id]);
  res.json({ message: "Comment deleted" });
};