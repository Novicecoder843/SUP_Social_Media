const pool = require('../config/db');
const { createuser } = require('../controller/userController');

exports.getuserData = async () =>{

    try{

        const result = await pool.query("SELECT * FROM users2 limit 10");
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
            `INSERT INTO user_schema.users2
            (name,address,city,password,email,mobile)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [data.name, data.address, data.city, data.password, data.email, data.mobile ]
          );
        console.log(result.rows);
        return result.rows

    }catch(error){
        console.log(error)
        return error
    }

}
