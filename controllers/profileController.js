const profileModel = require("../service/profileModel");

//  Create profile
const createProfile = async (req, res) => {
  const { username, bio, profile_image } = req.body; // ✅ unified field
  const user_id = req.user.id;

  try {
    const profile = await profileModel.createProfile(
      user_id,
      username,
      bio,
      profile_image
    );

    res.json({
      message: "Profile created",
      profile
    });

  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error); // ✅ debug
    res.status(500).send("Server error");
  }
};


//  Get profile
const getProfile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const profile = await profileModel.getProfile(user_id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);

  } catch (error) {
    console.error("GET PROFILE ERROR:", error); // ✅ debug
    res.status(500).send("Server error");
  }
};


//  Update profile
const updateProfile = async (req, res) => {
  const user_id = req.user.id;
  const { username, bio, profile_image } = req.body;

  try {
    const profile = await profileModel.updateProfile(
      user_id,
      username,
      bio,
      profile_image
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Please create profile first."
      });
    }

    res.json({
      message: "Profile updated",
      profile
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error); // ✅ debug
    res.status(500).send("Server error");
  }
};


module.exports = {
  createProfile,
  getProfile,
  updateProfile
};