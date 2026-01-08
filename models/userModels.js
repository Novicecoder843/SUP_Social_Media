const pool = require("../config/db");

exports.createUser = (data) => {
     const { username, email, password, full_name, bio, mobile } = data;
     return pool.query(
     ` INSERT INTO users (username, email, 
password, full_name, bio, mobile) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `
                     [username, email, password, full_name, bio, mobile]
        );

};