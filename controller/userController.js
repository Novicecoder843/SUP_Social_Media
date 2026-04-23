const UserModel = require("../models/userModel");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    
    const user = await UserModel.createUser(name, email, password, role_id);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getUsers();


    const baseUrl = `${req.protocol}://${req.get("host")}`;

const updatedUsers = users.map(user => {
  if (user.profile_image && !user.profile_image.startsWith("http")) {
    user.profile_image = `${baseUrl}/${user.profile_image}`;
  }
  return user;
});


    if (!users|| users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
      }
        return res.status(200).json({ success: true, data: users });
      }catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, error: err.message });
      }
    };

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role_id } = req.body;
    const user = await UserModel.updateUser(id, name, email, role_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
        console.log(err)

    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.deleteUser(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
        console.log(err)

    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
console.log(userId);


const result = await UserModel.getMe(userId);

const baseUrl = `${req.protocol}://${req.get("host")}`;

if (result.profile_image && !result.profile_image.startsWith("http")) {
  result.profile_image = `${baseUrl}/${result.profile_image}`;
}

if (result.background_image && !result.background_image.startsWith("http")) {
  result.background_image = `${baseUrl}/${result.background_image}`;
}

return res.status(200).json({
  data: result,
  success: true,
  message: "profile fetched successfully"
});

    
  } catch (err) {
    console.log(err)
    res.status(500).json({ data: [],success:false,message:"Internal server error"});
    return
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    console.log("Content-Type:", req.header["Content-type"]);
    const user_id = req.user.id;
    console.log("userId:", user_id);

    console.log("Body:", req.body);

    console.log("Files:", req.files);

    const { username, email, bio, } = req.body || {};

    if(!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required"
      });
    }

    let profile_image = null;
    let background_image = null;

    if (req.files?.profile_image) {
      profile_image = req.files.profile_image[0].filename;
    }

    if(req.files?.background_image) {
      background_image = req.files.background_image[0].filename;
    }

    const baseUrl =
    `${req.protocol}://${req.get("host")}`;

    let modify_prfl_image = profile_image ? `uploads/${profile_image}`: null;
    let modify_background_image = background_image ? `uploads/${background_image}`: null;

  
   const result = await UserModel.updateMe(user_id, username, email, bio, modify_prfl_image, modify_background_image);

   console.log("DB Result:", result);

   if (!result) {
    return res.status(404).json({
      success: false, 
      message: "User not found"
    });
   }

   return res.status(200).json({
    success:true,
    data: result,
    message: "Profile updates successfully"
   });
  } catch (err) {
    console.log(err);

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File size must be less than 5MB"});
    }
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error"
    });
  }
  };

exports.getUserProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const currentUserId = req.user.id;

    console.log("Username:", username);

    const user = await UserModel.getUserByUsername(username, currentUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedUsers
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};