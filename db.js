const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: process.env.DB_HOST,
  database: 'socialmedia_db',
  password: 'HIROlal@143',
  port: 5432,
  max: 10, 
  idleTimeoutMillis: 30000, 
});


pool.on('error', (err, client) => {
  console.error('Idle client error', err.message, err.stack);
});

async function queryDatabase() {
  try {
    const res = await pool.query('SELECT * FROM user2 ,', ['Connection to postgres successful!']);
    console.log(res.rows[0].message);
  } catch (err) {
    console.error('Error running query', err);
  }
}

queryDatabase();


