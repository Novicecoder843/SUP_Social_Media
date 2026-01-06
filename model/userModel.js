
const pool = require('../config/db');
const { createuser } = require('../controller/userController');

exports.getuserData = async () =>{

    try{

        const result = await pool.query("SELECT * FROM users limit 10");
        console.log(result.rows);
        return result.rows

    }catch(error){
        console.log(error)
        return error
    }

}

createuser
createUser
create_user
exports.CreateUser = async (data) =>{

    try{

        const result = await pool.query(
            `INSERT INTO user_schema.users
            (email, password, mobile, name, first_name, last_name, city)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [data.email, data.password, data.mobile, data.name, data.first_name, data.last_name, 
                data.city]
          );
        console.log(result.rows);
        return result.rows

    }catch(error){
        console.log(error)
        return error
    }

}
