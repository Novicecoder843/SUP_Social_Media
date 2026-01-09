
const UserModel = require('../model/userModel')

exports.getuser = async (req,res) =>{

    try{

        const userResult  = await UserModel.getuserData()

        if(userResult.length ===0){
            res.status(404).json({data:userResult,success:true, message: "User Not found" });
            return 
        }

        res.status(200).json({data:userResult,success:true, message: "User fetched successfully" });
        return 

    }catch(error){
        console.error(error);
        return res.status(500).json({data:[],sucess:false, message: "Internal server error" });
    }

}
//more than 3 arguments , use  object
exports.createuser = async (req,res) =>{

    try{

        const { email, password, mobile, name, first_name, last_name, city } = req.body;

        const userResult  = await UserModel.CreateUser(
            { email, password, mobile, name, first_name, last_name, city }
        )

        res.status(200).json({data:userResult,success:true, message: "User fetched successfully" });
        return 

    }catch(error){
        console.error(error);
        return res.status(500).json({data:[],sucess:false, message: "Internal server error" });
    }

}

