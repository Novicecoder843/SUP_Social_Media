require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/chats", require("./routes/chat.routes"));
// app.use("/api/chats", require("../routes/chat.routes"));

app.get("/", (req, res) => {
  res.send("Chat API running 🚀");
});
const PORT = process.env.PORT || 3001;
// app.listen(process.env.PORT, () => {
    app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
