require("dotenv").config();
const cookieParser = require("cookie-parser");
 const pool=require('./config/db');
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const roleRoutes = require("./routes/role.routes");
 
 const express=require('express');
    const app=express();
    app.use(express.json()); 
    
    app.use(cookieParser()); 
    
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);


port=3000

    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });
