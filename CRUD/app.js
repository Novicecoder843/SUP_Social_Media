

// const express = require("express");
// const app = express();

// app.use(express.json());

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

// const pool = require("./config/db");

// pool.query("SELECT NOW()")
//   .then(res => {
//     console.log("✅ DB Connected at:", res.rows[0]);
//   })
//   .catch(err => {
//     console.log("❌ DB Not Connected:", err.message);
//   });
const express = require("express");
const app = express();

app.use(express.json()); 
// This converts JSON → JavaScript object

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});






