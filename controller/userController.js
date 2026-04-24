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
    res.json({ success: true, data: users });
  } catch (err) {
        console.log(err)
    res.status(500).json({ success: false, error: err.message });
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

// exports.getMyProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const result = await UserModel.getMe(userId);
//     if(result.rows.length === 0)
//       return res.status(404).json({ message: "profile not found" });

//     res.json(result.rows[0]);

// } catch (err) {
//   res.status(500).json({ error: err.message });
// }
// };

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId)
    const result = await UserModel.getMe(userId);
    console.log(result, 'resu;ttttt')

    if (!result) {
      return res.status(404).json({ message: "profile not found" });
    }
    const fileUrl = result.profile_image
      ? `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${result.profile_image}`
      : null;

    result.profile_image = fileUrl;

    return res.status(200).json({ data: result, success: true, message: "profile fetched successfully" });

  } catch (err) {
    console.log(err)
    res.status(500).json({ data: [], success: false, message: "Internal server error" });
    return
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    console.log("Content-Type:", req.header["content-type"]);
    const user_id = req.user.id;
    console.log("userId:", user_id);

    console.log("Body:", req.body);

    console.log("Files:", req.files);

    const { username, email, bio } = req.body || {};

    if(!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required"
      });
    }

    let profile_image = null;
    let background_image = null;

    if (req.files?.profile_image) {
      profile_image = req.files.profile_image[0].key;
    }

    if(req.files?.background_image) {
      background_image = req.files.background_image[0].key;
    }

    const result = await UserModel.updateMe(user_id, username, email, bio, profile_image, background_image);

    console.log("DB Result:", result);
    console.log("FILES DEBUG:", JSON.stringify(req.files, null, 2));
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
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