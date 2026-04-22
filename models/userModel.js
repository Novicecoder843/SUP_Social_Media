const db = require("../config/db");

exports.createUser = async (username, email, password, role_id) => {
  const query = `
    INSERT INTO users (username, email, password, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role_id
  `;
  const result = await db.query(query, [username, email, password, role_id]);
  return result.rows[0];
};

exports.getUsers = async () => {
  const query = `
    SELECT users.id, users.name, users.email, roles.name AS role
    FROM users
    JOIN roles ON users.role_id = roles.id
  `;
  const result = await db.query(query);
  return result.rows;
};

exports.updateUser = async (id, name, email, role_id) => {
  const query = `
    UPDATE users
    SET name = $1, email = $2, role_id = $3
    WHERE id = $4
    RETURNING id, name, email, role_id
  `;
  const result = await db.query(query, [name, email, role_id, id]);
  return result.rows[0];
};

exports.deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

//*
exports.getMe = async (userId) => {
  try {
    const query = `
    SELECT 
      u.id,
      u.email,
      u.username,
      up.bio,
      up.profile_image,

      (SELECT COUNT(*) FROM user_followers WHERE user_id = u.id) AS followers,
      (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id) AS following
    FROM users u
    LEFT JOIN user_profiles up ON up.user_id = u.id
    WHERE u.id = $1
  `;

    const result = await db.query(query, [userId]);
    return result.rows[0];
  } catch (error) {
    console.log(error)
    throw error
  }
};

exports.updateMe = async (
  user_id,
  username,
  email,
  bio,
  profile_image,
  background_image
) => {
  try {

    await db.query(
      `UPDATE public.users
    SET
     name = COALESCE($1, name),
     email = COALESCE($2, email)
      WHERE id = $3`,
      [username, email, user_id]
    );
    
    const result = await db.query(
          `INSERT INTO user_profiles
       (user_id, username, bio, profile_image, background_image)
    VALUES (
    $1, 
    COALESCE($2, (SELECT name FROM users WHERE id = $1)),
    $3,
    $4,
    $5
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
     username = COALESCE(EXCLUDED.username, user_profiles.username),
     bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
     profile_image = COALESCE(EXCLUDED.profile_image, user_profiles.profile_image),
     background_image = COALESCE(EXCLUDED.background_image, user_profiles.background_image)
    RETURNING *`,
      [user_id, username, bio, profile_image, background_image]
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getUserByUsername = async (username, currentUserId) => {
  try {
    const query = `
    SELECT 
      u.id,
      u.username,
      up.bio,
      up.profile_image,

      (SELECT COUNT(*) FROM user_followers WHERE user_id = u.id) AS followers,
      (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id) AS following,

       (SELECT COUNT(*) FROM user_followers 
              WHERE user_id = u.id AND follower_id = $2) AS is_following

    FROM users u
    LEFT JOIN user_profiles up ON up.user_id = u.id

    WHERE LOWER(u.username) = LOWER($1)
    `;

    const result = await db.query(query, [username, currentUserId]);

    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const values = [email];

  const result = await db.query(query, values);
  return result;
};