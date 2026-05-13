// const pool = require("../config/db");

// exports.createReel = async (data) => {
//   const {
//     user_id,
//     caption,
//     video_url,
//     thumbnail_url,
//     duration,
//   } = data;

//   const result = await pool.query(
//     `
//     INSERT INTO reels
//     (user_id, caption, video_url, thumbnail_url, duration)
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING *
//     `,
//     [user_id, caption, video_url, thumbnail_url, duration]
//   );

//   return result.rows[0];
// };

// exports.getAllReels = async () => {
//   const result = await pool.query(`
//     SELECT reels.*, users.username, users.profile_image
//     FROM reels
//     JOIN users ON reels.user_id = users.id
//     ORDER BY reels.created_at DESC
//   `);

//   return result.rows;
// };

// exports.getSingleReel = async (id) => {
//   const result = await pool.query(
//     `
//     SELECT * FROM reels
//     WHERE id = $1
//     `,
//     [id]
//   );

//   return result.rows[0];
// };

// exports.deleteReel = async (id) => {
//   await pool.query(
//     `
//     DELETE FROM reels
//     WHERE id = $1
//     `,
//     [id]
//   );
// };