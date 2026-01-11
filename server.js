const express = require("express");
const bodyParser = require("body-parser");
const roleRoutes = require("./routes/roleRouts");
const authRouter =  require("./routes/authRouters")
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// app.use("/api/users", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth", authRouter );

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000 ");
});
