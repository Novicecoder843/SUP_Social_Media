const UserProfile = require("../model/userprofile.model");

/* ================= CREATE MY PROFILE ================= */
exports.createMyProfile = async (req, res) => {
  try {
    const { bio, profile_image, cover_image } = req.body;

    if (!bio && !profile_image && !cover_image) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    const newProfile = await UserProfile.createProfile(
      req.user.id,
      bio,
      profile_image,
      cover_image
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: newProfile,
    });

  } catch (error) {

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET MY PROFILE ================= */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await UserProfile.getMyProfile(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE MY PROFILE ================= */
exports.updateMyProfile = async (req, res) => {
  try {
    const { bio, profile_image, cover_image } = req.body;

    const updatedProfile = await UserProfile.updateProfile(
      req.user.id,
      bio,
      profile_image,
      cover_image
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET USER BY ID ================= */
exports.getUserById = async (req, res) => {
  try {
    const user = await UserProfile.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
