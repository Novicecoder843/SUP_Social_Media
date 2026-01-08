const userModel = require("../models/userModels");

exports.createUser = async (req, res) => {
    try {
        const result = await 
userModel.createUser(req.body);
 res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};   
  
