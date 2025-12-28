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

app.post('/createuser',async (req,res) =>{

    try{


    const userName = req.body.name
    const email = req.body.email
    const usermobile  = req.body.mobile

    //destructuring
    const insertData = await pool.query(
    `insert into users2(name,email,mobile)
     values (${userName},${email},${usermobile})`
    )

    res.status(201).json({ 
        result:insertData.rows,
        status:true,
        message: 'User created successfully' });

    }catch(error){
        res.status(500).json({ 
            result:[],
            status:false,
            message: error.message });
    }
   

})
  
 app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users2");
    console.log(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});
port=3000

    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });
