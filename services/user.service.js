const pool = require("../config/db");
const { getImageUrl } = require("../utils/s3url");
exports.getMe = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.email,
      p.username,
      p.bio,
      p.profile_image,

      -- followers count
      (SELECT COUNT(*) 
       FROM user_followers 
       WHERE following_id = u.id) AS followers,

      -- following count
      (SELECT COUNT(*) 
       FROM user_followers 
       WHERE follower_id = u.id) AS following

    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = $1
    `,
    [userId]
  );
const user = result.rows[0];

return {
  ...user,
  profile_image: getImageUrl(user.profile_image), 
  followers: parseInt(user.followers),
  following: parseInt(user.following),
};
};
exports.updateMe = async (userId, data) => {

  const { username, bio, profile_image } = data;

  const check = await pool.query(
    "SELECT * FROM user_profiles WHERE username=$1 AND user_id != $2",
    [username, userId]
  );

  if (check.rows.length > 0) {
    throw new Error("Username already taken");
  }

  await pool.query(
    `INSERT INTO user_profiles(user_id, username, bio, profile_image)
     VALUES($1,$2,$3,$4)
     ON CONFLICT (user_id)
     DO UPDATE SET
       username=$2,
       bio=$3,
       profile_image=$4,
       updated_at=NOW()`,
    [userId, username, bio, profile_image]
  );

  return { message: "Profile updated" };
};

exports.getUserById = async (myId, userId) => {

  const blocked = await pool.query(
    `SELECT * FROM user_blocks
     WHERE (blocker_id=$1 AND blocked_id=$2)
        OR (blocker_id=$2 AND blocked_id=$1)`,
    [myId, userId]
  );

  if (blocked.rows.length > 0) {
    throw new Error("User not accessible");
  }

  const result = await pool.query(
    `SELECT user_id, username, bio, profile_image
     FROM user_profiles WHERE user_id=$1`,
    [userId]
  );

  const follow = await pool.query(
    `SELECT * FROM user_followers
     WHERE follower_id=$1 AND following_id=$2`,
    [myId, userId]
  );

 const user = result.rows[0];

return {
  ...user,
  profile_image: getImageUrl(user.profile_image), 
  is_following: follow.rows.length > 0,
};
};
exports.updateProfileImage = async (userId, imagePath) => {

  await pool.query(
    `INSERT INTO user_profiles(user_id, profile_image)
     VALUES($1,$2)
     ON CONFLICT (user_id)
     DO UPDATE SET profile_image=$2`,
    [userId, imagePath]
  );

  const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imagePath}`;

  return {
    message: "Profile image updated",
    image: imageUrl,
  };
};

exports.follow = async (myId, userId) => {

  if (myId == userId) {
    throw new Error("Cannot follow yourself");
  }

  await pool.query(
    `INSERT INTO user_followers(follower_id, following_id)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING`,
    [myId, userId]
  );

  return { message: "Followed" };
};

exports.unfollow = async (myId, userId) => {

  await pool.query(
    `DELETE FROM user_followers
     WHERE follower_id=$1 AND following_id=$2`,
    [myId, userId]
  );

  return { message: "Unfollowed" };
};

exports.block = async (myId, userId) => {

  await pool.query(
    `INSERT INTO user_blocks(blocker_id, blocked_id)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING`,
    [myId, userId]
  );
  await pool.query(
    `DELETE FROM user_followers
     WHERE (follower_id=$1 AND following_id=$2)
        OR (follower_id=$2 AND following_id=$1)`,
    [myId, userId]
  );

  return { message: "User blocked" };
};
exports.createPost = async (userId, image, caption) => {

  const result = await pool.query(
    `INSERT INTO posts(user_id, image, caption)
     VALUES($1,$2,$3) RETURNING *`,
    [userId, image, caption]
  );

  return {
    message: "Post created",
    post: result.rows[0],
  };
};
exports.likePost = async (userId, postId) => {

  await pool.query(
    `INSERT INTO post_likes(user_id, post_id)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING`,
    [userId, postId]
  );

  return { message: "Liked" };
};
exports.unlikePost = async (userId, postId) => {

  await pool.query(
    `DELETE FROM post_likes
     WHERE user_id=$1 AND post_id=$2`,
    [userId, postId]
  );

  return { message: "Unliked" };
};
exports.commentPost = async (userId, postId, comment) => {

  
  const post = await pool.query(
    "SELECT id FROM posts WHERE id=$1",
    [postId]
  );

  if (post.rows.length === 0) {
    throw new Error("Post not found");
  }
  await pool.query(
    `INSERT INTO post_comments(user_id, post_id, comment)
     VALUES($1,$2,$3)`,
    [userId, postId, comment]
  );

  return { message: "Comment added" };
};
exports.deletePost = async (userId, postId) => {

 
  await pool.query(
    `DELETE FROM post_comments WHERE post_id=$1`,
    [postId]
  );

 
  await pool.query(
    `DELETE FROM post_likes WHERE post_id=$1`,
    [postId]
  );

  await pool.query(
    `DELETE FROM post_shares WHERE post_id=$1`,
    [postId]
  );


  await pool.query(
    `DELETE FROM posts WHERE id=$1 AND user_id=$2`,
    [postId, userId]
  );

  return { message: "Post deleted successfully" };
};
exports.sharePost = async (userId, postId) => {

  await pool.query(
    `INSERT INTO post_shares(user_id, post_id)
     VALUES($1,$2)`,
    [userId, postId]
  );

  return { message: "Post shared" };
};
exports.savePost = async (userId, postId) => {
  await pool.query(
    `
    INSERT INTO saved_posts(user_id, post_id)
    VALUES($1,$2)
    ON CONFLICT DO NOTHING
    `,
    [userId, postId]
  );
  return { message: "Post saved" };
};
exports.unsavePost = async (userId, postId) => {
  await pool.query(
    `
    DELETE FROM saved_posts
    WHERE user_id=$1 AND post_id=$2
    `,
    [userId, postId]
  );

  return { message: "Post removed" };
};