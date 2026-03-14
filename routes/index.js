const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);
module.exports = router;
