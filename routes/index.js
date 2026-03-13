const router = require("express").Router();

const authroutes=require("../routes/auth.routes");
const userRoutes=require("../routes/auth.routes");


router.use("/auth",authroutes);
router.use("/users",userRoutes);


module.exports=router;