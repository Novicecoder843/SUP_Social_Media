const profileModel = require("../service/profileModel");

// CREATE PROFILE 
const createProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const username = req.body?.username;
    const bio = req.body?.bio;

    const profile_image = req.file ? req.file.key : null;

    // Validation
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check username exists
    const existingUsername = await profileModel.findByUsername(username);

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create profile
    const profile = await profileModel.createProfile(
      user_id,
      username,
      bio,
      profile_image
    );

    res.json({
      message: "Profile created successfully",
      profile
    });

  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const profile = await profileModel.getProfile(user_id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.profile_image) {
      // If already full URL (old data), don't change
      if (!profile.profile_image.startsWith("http")) {
        profile.profile_image =
          process.env.AWS_BASE_URL + "/" + profile.profile_image;
      }
    }

    res.json({
      message: "Profile fetched successfully",
      profile
    });

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const username = req.body?.username;
    const bio = req.body?.bio;

    const profile_image = req.file ? req.file.key : undefined;

    // Validation
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check username exists (exclude current user)
    const existingUsername = await profileModel.findByUsername(username);

    if (existingUsername && existingUsername.user_id != user_id) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //  Update profile
    const profile = await profileModel.updateProfile(
      user_id,
      username,
      bio,
      profile_image
    );

    res.json({
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};