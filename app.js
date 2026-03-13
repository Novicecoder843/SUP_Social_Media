const express = require("express");
require("dotenv").config();

const Routes = require("./routes/index");

const app = express();

app.use(express.json());

app.use("/api", Routes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});