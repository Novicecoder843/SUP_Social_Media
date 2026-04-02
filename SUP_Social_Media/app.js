const express = require('express');
require('dotenv').config();

const roleRoutes = require('./routes/role.routes');
const postRoutes = require('./routes/post.routes');
const app = express();
const likeRoutes = require('./routes/like.routes');
const commentRoutes = require('./routes/comment.routes');
const hashtagRoutes = require('./routes/hashtag.routes');
const mentionRoutes = require('./routes/mention.routes');
const savedRoutes = require('./routes/saved.routes');
app.use(express.json());
app.use('/api', likeRoutes);
app.use('/api', commentRoutes);

app.use('/api/roles', roleRoutes);
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/uploads", express.static("uploads"));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size must be less than 2MB"
      });
    }
  }

  if (err.message.includes("Only images")) {
    return res.status(400).json({ message: err.message });
  }

  next(err);
});
app.use('/uploads', express.static('uploads'));
app.use('/api/posts', postRoutes);
app.use('/api', mentionRoutes);
app.use('/api', savedRoutes);
app.use('/api', hashtagRoutes);
module.exports = app;








