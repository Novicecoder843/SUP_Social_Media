
const router = require("express").Router();
router.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const chatroutes = require("./chat.routes");
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatroutes);
router.use("/posts", userRoutes );
const notificationRoutes = require("./notification.routes");
router.use("/notifications", notificationRoutes);
module.exports = router;


