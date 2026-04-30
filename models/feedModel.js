const pool = require("../config/db");

exports.getFeed = () => {
  return pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
};