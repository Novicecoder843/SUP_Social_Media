const express = require("express");
const bodyParser = require('body-parser')
//const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use("/api", userRoutes);

app.use("/api", require("./routes/authRoutes"));

const roleRoutes = require("./routes/roleRoutes");
app.use("/api", roleRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

// app.get("/", (req, res) => {
//     res.send("Sever is running fine");
// });


// app.get("/db", async (req, res) => {
//     try {
//         const result = await
//         client.query("SELECT NOW()");
//         res.json({
//             message: "Database connected successfully",
//             time: result.rows[0]
//         }); 
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// app.post("/users", async (req, res) => {
//     try {
//         const { username, email, password, full_name, bio, mobile } = req.body;

//         const result = await pool.query(
//         ` INSERT INTO users (username, email, 
// password, full_name, bio, mobile) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `
//                      [username, email, password, full_name, bio, mobile]
//         );
            
//             res.status(201).json(result.rows[0]);
//     } catch (error) {
//         res.status(500).json({ error: error.message});
//     }
// });
// app.get("/users", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
//         res.json(result.rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// app.get("/users/:id", async (req, res) => {
//     try {
//         const result = await pool.query( "SELECT * FROM users WHERE id = $1", [req.params.id]);
//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(result.rows[0]);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// app.put("/users/:id", async (req, res) => {
//     try {
//         const { full_name, bio, mobile } = req.body;
//         const result = await pool.query( `UPDATE users SET full_name = $1, bio = $2, mobile = $3 WHERE id = $4 
//             RETURNING * `, [full_name, bio, mobile, req.params.id]);
//             if (result.rows.length === 0) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//             res.json(result.rows[0]);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// app.delete("/users/:id", async (req, res) => {
//     try {
//         const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [req.params.id]);
//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json({ message: "User deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


