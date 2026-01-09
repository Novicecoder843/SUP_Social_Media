
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
// //more than 3 arguments , use  object
// exports.createuser = async (req,res) =>{

//     try{

//         const { name,address,city,password,email,mobile } = req.body;

//         const userResult  = await UserModel.CreateUser(
//             { name,address,city,password,email,mobile }
//         )

//         res.status(200).json({data:userResult,success:true, message: "User fetched successfully" });
//         return 

//     }catch(error){
//         console.error(error);
//         return res.status(500).json({data:[],sucess:false, message: "Internal server error" });
//     }

// }

// CRUD OPERATION 

const User = require('../models/userModel');

// CREATE
exports.createUser = async (req, res) => {
  try {
    const { name, address, city, password, email, mobile } = req.body;

    const user = await User.create({
      name,
      address,
      city,
      password,
      email,
      mobile
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL 
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID 
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE 
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE 
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


