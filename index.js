
 require("dotenv").config();
 const pool=require('./db');

 const userRoutes = require('./routes/userRoute')
 const express=require('express');
    const app=express();
    app.use(express.json());  
    
    app.get('/',async (req,res) =>{
        res.status(200).json({ message: "Server  Connected" });
    })

app.use('/api/v1/users',userRoutes)

//    app.get("/", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM users");
//     console.log(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Database error" });
//   }
// });

// localhost:3000/api/v1/users/getuser
port=3000

    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });