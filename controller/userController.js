const UserModel = require("../models/userModel");
const uploadToS3 = require("../config/uploadToS3");

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

//const updatedUsers = users.map(user => {
  //if (user.profile_image && !user.profile_image.startsWith("http")) {
   // user.profile_image = `${baseUrl}/${user.profile_image}`;
 // }
  //return user;
//});


    if (!users|| users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
      }
        return res.status(200).json({ success: true, data: updatedUsers });
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

    const result = await UserModel.getMe(userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    if (result.profile_image) {
      result.profile_image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${result.profile_image}`;
    }

    if (result.background_image) {
      result.background_image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${result.background_image}`;
    }

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { username, email, bio } = req.body || {};

    let profile_image = null;
    let background_image = null;

    // Profile Image Upload
    if (req.files?.profile_image?.length > 0) {
      const file = req.files.profile_image[0];

      await uploadToS3(file.path, file.originalname);

      profile_image = `images/${file.originalname}`;
    }

    // Background Image Upload
    if (req.files?.background_image?.length > 0) {
      const file = req.files.background_image[0];

      await uploadToS3(file.path, file.originalname);

      background_image = `images/${file.originalname}`;
    }

    const result = await UserModel.updateMe(
      user_id,
      username,
      email,
      bio,
      profile_image,
      background_image
    );

    // Full URL Return
    if (result.profile_image) {
      result.profile_image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${result.profile_image}`;
    }

    if (result.background_image) {
      result.background_image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${result.background_image}`;
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Profile updated successfully"
    });

  } catch (err) {
    console.log(err);
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

    // return res.status(200).json({
    //   success: true,
    //   data: updatedUsers
    // });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

if (user.profile_image && !user.profile_image.startsWith("http")) {
  user.profile_image = `${baseUrl}/${user.profile_image}`;
}

if (user.background_image && !user.background_image.startsWith("http")) {
  user.background_image = `${baseUrl}/${user.background_image}`;
}

return res.status(200).json({
  success: true,
  data: user
});

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};