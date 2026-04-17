const express = require("express");
const router = require("express").Router();

const chatroutes = require("./chat.routes");
router.use("/chat", chatroutes);

router.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;


