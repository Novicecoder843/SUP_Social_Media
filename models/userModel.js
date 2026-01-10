const pool = require("../config/db");

exports.findByEmail = (email)=>{

    return pool.query("SELECT * FROM users WHERE email=$1", [email]);

};


exports.createUser = (data)=>{
    const {name, email, password_hash, role_id } = data;
    return pool.quary( `INSERT INTO user_schema.userstable (name,email,password_hash,role_id)
     VALUES ($1,$2,$3,$4)`, [name, email, password_hash, role_id] );
};