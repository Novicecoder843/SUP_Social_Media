const express = require('express');
require('dotenv').config();

const roleRoutes = require('./routes/role.routes');

const app = express();
app.use(express.json());

app.use('/api/roles', roleRoutes);

module.exports = app;
