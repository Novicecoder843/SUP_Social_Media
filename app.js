const express = require("express");
require("dotenv").config();

const routes = require("./routes");

const app = express();

app.use(express.json());

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
 