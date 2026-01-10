
const pool = require("../config/db");

class UserModel {

    // CREATE SINGLE USER
    static async createUser(data) {
        const {
            username,
            email,
            password_hash,
            full_name,
            phone_number,
            gender,
            date_of_birth,
            bio,
            profile_picture
        } = data;

        const result = await pool.query(
            `INSERT INTO user_schema.users
      (username, email, password_hash, full_name, phone_number,
       gender, date_of_birth, bio, profile_picture)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
            [
                username,
                email,
                password_hash,
                full_name,
                phone_number,
                gender,
                date_of_birth,
                bio,
                profile_picture
            ]
        );

        return result.rows[0];
    }

    // CREATE MULTIPLE USERS (for...of + transaction)
    static async createMultipleUsers(users) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const insertedUsers = [];

            for (const user of users) {
                const result = await client.query(
                    `INSERT INTO user_schema.users
          (username, email, password_hash, full_name, phone_number,
           gender, date_of_birth, bio, profile_picture)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
          RETURNING *`,
                    [
                        user.username,
                        user.email,
                        user.password_hash,
                        user.full_name,
                        user.phone_number,
                        user.gender,
                        user.date_of_birth,
                        user.bio,
                        user.profile_picture
                    ]
                );
                insertedUsers.push(result.rows[0]);
            }

            await client.query("COMMIT");
            return insertedUsers;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    // FETCH ALL USERS
    static async fetchAllUser() {
        const result = await pool.query(
            "SELECT * FROM user_schema.users ORDER BY created_at DESC"
        );
        return result.rows;
    }

    // FETCH USER BY ID
    static async fetchUserById(id) {
        const result = await pool.query(
            "SELECT * FROM user_schema.users WHERE user_id=$1",
            [id]
        );
        return result.rows[0];
    }

    // UPDATE USER
    static async updateUser(id, data) {
        const {
            username,
            email,
            password_hash,
            full_name,
            phone_number,
            gender,
            date_of_birth,
            bio,
            profile_picture,
            is_active
        } = data;

        const result = await pool.query(
            `UPDATE user_schema.users
       SET 
       username = $1, 
       email =$2 , 
       password_hash = $3 , 
       full_name = $4 , 
       phone_number = $5, 
       gender = $6, 
       date_of_birth =$7, 
       bio = $8, 
       profile_picture = $9, 
       is_active = $10,
       updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $11
       RETURNING *`,
            [
                username,
                email,
                password_hash,
                full_name, phone_number,
                gender, date_of_birth,
                bio,
                profile_picture,
                is_active,
                id
            ]
        );

        return result.rows[0];
    }

    // DELETE USER
    static async deleteUser(id) {
        const result = await pool.query(
            "DELETE FROM user_schema.users WHERE user_id=$1 RETURNING *",
            [id]
        );
        return result.rows[0];
    }
}

module.exports = UserModel;
