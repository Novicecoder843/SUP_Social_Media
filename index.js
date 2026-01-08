require("dotenv").config();
 const pool=require('./config/db');
const userRoutes = require("./routes/user.routes");
 
 const express=require('express');
    const app=express();
    app.use(express.json());  
    
app.use("/api/users", userRoutes);


port=3000

    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });
