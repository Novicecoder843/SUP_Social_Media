const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const userModel = require("../service/model");


// Get all users 
router.get(
  "/",
  authMiddleware,
  authorizeRole(1),
  async (req, res) => {
    try {
      const users = await userModel.getUsersWithRoles();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// Logged-in user
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User data",
    user: req.user,
    sucess:true,
  });
});

module.exports = router;