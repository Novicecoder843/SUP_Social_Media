const pool = require("../config/db");

exports.createUser = (user) => {
  return pool.query(
    `INSERT INTO user_schema.userstable (full_name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user.full_name, user.email, user.password_hash, user.role_id]
  );
};

exports.findByEmail = (email) => {
  return pool.query(`SELECT * FROM user_schema.userstable WHERE email=$1`, [email]);
};

exports.findRoleById = (role_id) => {
  return pool.query(`SELECT * FROM user_schema.userstable WHERE role_id=$1`, [role_id]);
};

exports.saveLoginOtp = (id, otp, expires) => {
  return pool.query(
    `UPDATE user_schema.userstable
     SET login_otp = $1,
         login_otp_expires = $2
     WHERE id = $3`,
    [otp, expires, id]
  );
};

exports.clearLoginOtp = (id) => {
  return pool.query(
    `UPDATE user_schema.userstable
     SET login_otp = NULL,
         login_otp_expires = NULL,
         is_email_verified = true
     WHERE id = $1`,
    [id]
  );
};




exports.getAllUsers = () => {
  return pool.query(
    `SELECT id, full_name, email, role_id 
         FROM user_schema.userstable 
         WHERE status = 'active'`
  );
};

exports.getUserById = (id) => {
  return pool.query(
    `SELECT id, full_name, email, role_id 
         FROM user_schema.userstable 
         WHERE id = $1`,
    [id]
  );
};

exports.updateUser = (id, full_name, role_id) => {
  return pool.query(
    `UPDATE user_schema.userstable
         SET full_name = $1, role_id = $2, updated_at = NOW()
         WHERE id = $3`,
    [full_name, role_id, id]
  );
};

exports.softDeleteUser = (id) => {
  return pool.query(
    `UPDATE user_schema.userstable
         SET status = 'inactive', updated_at = NOW()
         WHERE id = $1`,
    [id]
  );
};








/* ===================== GET MY PROFILE ===================== */
exports.getMyProfile = (userId) => {
  return pool.query(`
    SELECT 
      u.id,
      u.full_name,
      u.email,
      p.username,
      p.bio,
      p.profile_image,
      p.cover_image,
      COUNT(f.following_id) AS followers
    FROM user_schema.userstable u
    JOIN user_schema.user_profiles p ON p.user_id = u.id
    LEFT JOIN user_schema.user_followers f ON f.following_id = u.id
    WHERE u.id = $1
    GROUP BY u.id, p.username, p.bio, p.profile_image, p.cover_image
  `, [userId]);
};

/* ===================== UPDATE PROFILE ===================== */
exports.isUsernameTaken = (username, userId) => {
  return pool.query(`
    SELECT 1 FROM user_schema.user_profiles
    WHERE username = $1 AND user_id != $2
  `, [username, userId]);
};

exports.updateProfile = (userId, data) => {
  const { username, bio, profile_image, cover_image } = data;

  return pool.query(`
    UPDATE user_schema.user_profiles
    SET
      username = $1,
      bio = $2,
      profile_image = $3,
      cover_image = $4,
      updated_at = NOW()
    WHERE user_id = $5
  `, [username, bio, profile_image, cover_image, userId]);
};

/* ===================== PUBLIC PROFILE ===================== */
exports.getProfileById = (id) => {
  return pool.query(`
    SELECT 
      u.id,
      p.username,
      p.bio,
      p.profile_image,
      p.cover_image
    FROM user_schema.userstable u
    JOIN user_schema.user_profiles p ON p.user_id = u.id
    WHERE u.id = $1
  `, [id]);
};

/* ===================== FOLLOW / UNFOLLOW ===================== */
exports.followUser = (userId, targetId) => {
  return pool.query(`
    INSERT INTO user_schema.user_followers (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [userId, targetId]);
};

exports.unfollowUser = (userId, targetId) => {
  return pool.query(`
    DELETE FROM user_schema.user_followers
    WHERE follower_id = $1 AND following_id = $2
  `, [userId, targetId]);
};

/* ===================== BLOCK ===================== */
exports.blockUser = async (userId, targetId) => {
  await pool.query(`
    DELETE FROM user_schema.user_followers
    WHERE (follower_id = $1 AND following_id = $2)
       OR (follower_id = $2 AND following_id = $1)
  `, [userId, targetId]);

  return pool.query(`
    INSERT INTO user_schema.user_blocks (blocker_id, blocked_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [userId, targetId]);
};
