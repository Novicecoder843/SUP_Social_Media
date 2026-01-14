          const pool = require("../config/db");

          const User = {
            create: async (data) => {
              const query = `
                INSERT INTO users 
                (username, email, password, full_name, bio, profile_pic, mobile, gender, is_verified, is_active)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                RETURNING *;
              `;

              const values = [
                data.username,
                data.email,
                data.password,
                data.full_name,
                data.bio,
                data.profile_pic,
                data.mobile,
                data.gender,
                data.is_verified || false,
                data.is_active ?? true
              ];

              return pool.query(query, values);
            },

            findAll: () => {
              return pool.query("SELECT * FROM users ORDER BY id DESC");
            },

            findById: (id) => {
              return pool.query("SELECT * FROM users WHERE id = $1", [id]);
            },

            updateById: (id, data) => {
              const query = `
                UPDATE users SET
                  username=$1,
                  email=$2,
                  full_name=$3,
                  bio=$4,
                  profile_pic=$5,
                  mobile=$6,
                  gender=$7,
                  is_verified=$8,
                  is_active=$9,
                  updated_at=CURRENT_TIMESTAMP
                WHERE id=$10
                RETURNING *;
              `;

              const values = [
                data.username,
                data.email,
                data.full_name,
                data.bio,
                data.profile_pic,
                data.mobile,
                data.gender,
                data.is_verified,
                data.is_active,
                id
              ];

              return pool.query(query, values);
            },

            deleteById: (id) => {
              return pool.query("DELETE FROM users WHERE id = $1", [id]);
            }
          };

          module.exports = User;