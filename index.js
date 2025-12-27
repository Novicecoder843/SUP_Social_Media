
 //require("dotenv").config();
 const pool=require('./db');

 const express=require('express');
    const app=express();
    app.use(express.json());  
    
    app.get('/',async (req,res) =>{
        res.status(200).json({ message: "Server  Connected" });
    })

app.post('/createuser',async (req,res) =>{

    try{


    const userName = req.body.name
    const email = req.body.email
    const usermobile  = req.body.mobile

    //destructuring
    const insertData = await pool.query(
    `insert into users(name,email,mobile)
     values (${userName},${email},${usermobile})`
    )

    res.status(201).json({ 
        result:insertData.rows,
        status:true,
        message: 'User created successfully' });

    }catch(error){
        res.status(500).json({ 
            result:[],
            status:false,
            message: error.message });
    }
   

})
//    app.get("/", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM users");
//     console.log(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Database error" });
//   }
// });
port=3000

    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });