const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;


