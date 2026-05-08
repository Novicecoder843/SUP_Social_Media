// const { DataBrew } = require("aws-sdk");
const pool = require("../config/db");
const db = require("../config/db");

// ADD COMMENT
exports.addComment = (user_id, post_id, comment_text, parent_id) => {
  return db.query(
    `INSERT INTO comments (user_id, post_id, comment_text, parent_id) VALUES ($1,$2,$3,$4) RETURNING *`
    [user_id, post_id, comment_text, parent_id]
  );
};

//ADD REPLY
exports.addReply = (post_id, user_id, comment_text, parent_id) => {
  return db.query(
    `INSERT INTO comments (post_id, user_id, comment_text, parent_id) VALUES ($1, $2, $3, $4) RETURNING * `,
    [post_id, user_id, comment_text, parent_id]
  );
};

// GET COMMENTS + REPLIES
exports.getCommentsWithReplies = (postId) => {
  return db.query(
    `
    SELECT 
      c.id,
      c.comment_text,
      c.parent_id,
      c.created_at,

      json_build_object(
        'id', u.id,
        'name', u.name
      ) as user,
       -- REPLIES
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', r.id,
              'comment_text', r.comment_text,
              'parent_id', r.parent_id,
              'created_at', r.created_at,
              'user', json_build_object(
                'id', ru.id,
                'name', ru.name
              )
            )
          )
          FROM comments r
          JOIN users ru ON ru.id = r.user_id
          WHERE r.parent_id = c.id
        ), '[]'
      ) as replies

    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
    AND c.parent_id IS NULL

    ORDER BY c.created_at DESC
  `, [postId]);
};

// // GET COMMENTS
// exports.getComments = (post_id) => {
//   return pool.query(
//     "SELECT * FROM comments WHERE post_id=$1 ORDER BY created_at DESC",
//     [post_id]
//   );
// };

// DELETE COMMENT (only owner)
exports.deleteComment = (comment_id, user_id) => {
  return pool.query(
    "DELETE FROM comments WHERE id=$1 AND user_id=$2",
    [comment_id, user_id]
  );
};