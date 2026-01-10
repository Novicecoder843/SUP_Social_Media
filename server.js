const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRouts");
const roleRoutes = require("./routes/roleRouts");


const app = express();
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/role", roleRoutes);

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000 ");
});
