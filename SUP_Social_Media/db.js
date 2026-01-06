const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env:"postgres",
  host: process.env:"localhost",
  database: process.env:"socialmedia_db",
  password: process.env:"HIROlal@143",
  port: process.env:5432,
});

pool.connect()
  .then(() => console.log('PostgreSQL connected ✅'))
  .catch(err => console.error('DB error ❌', err));

module.exports = pool;
