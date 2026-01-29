const express = require('express');
require('dotenv').config();

const roleRoutes = require('./routes/role.routes');

const app = express();
app.use(express.json());

app.use('/api/roles', roleRoutes);
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/uploads", express.static("uploads"));

module.exports = app;



