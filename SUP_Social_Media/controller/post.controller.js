// const Post = require('../models/post.model');
// exports.createPost = async (req, res) => {
//   try {
//     const { content, visibility } = req.body;
//     const files = req.files || [];

//     if (!content && files.length === 0) {
//       return res.status(400).json({
//         error: "Content or media required"
//       });
//     }

//     const images = files.filter(f => f.mimetype.startsWith('image'));
//     const videos = files.filter(f => f.mimetype.startsWith('video'));

//     if (videos.length > 1) {
//       return res.status(400).json({ error: "Only one video allowed" });
//     }

//     if (images.length > 5) {
//       return res.status(400).json({ error: "Max 5 images allowed" });
//     }

//     // create post
//     const newPost = await Post.create(
//       req.user.id, // from JWT middleware
//       content || '',
//       visibility || 'public'
//     );

//     // save media
//     for (let file of files) {
//       const type = file.mimetype.startsWith('image')
//         ? 'image'
//         : 'video';

//       await Post.addMedia(newPost.id, file.filename, type);
//     }

//     res.status(201).json({
//       message: "Post created",
//       postId: newPost.id
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getPost = async (req, res) => {
//   const post = await Post.getById(req.params.id);
//   if (!post) return res.status(404).json({ error: "Post not found" });
//   res.json(post);
// };

// exports.updatePost = async (req, res) => {
//  const post = await Post.update(
//     req.params.id,
//     req.body.content,
//     req.body.visibility
//   );
//   if (!post) return res.status(404).json({ error: "Post not found" });
//   res.json(post);
// };

// exports.deletePost = async (req, res) => {
//   await Post.delete(req.params.id);
//   res.json({ message: "Post deleted" });
// };

// exports.getFeed = async (req, res) => {
//   const posts = await Post.getFeed();
//   res.json(posts);
// };

// exports.getUserPosts = async (req, res) => {
//   const posts = await Post.getUserPosts(req.params.id);
//   res.json(posts);
// };

const Post = require('../models/post.model');

exports.createPost = async (req, res) => {
  try {
    const { content, visibility } = req.body;
    const files = req.files || [];

    // ❌ validation
    if (!content && files.length === 0) {
      return res.status(400).json({
        error: "Content or media required"
      });
    }

    // 🔥 validation (same as your logic)
    const images = files.filter(f => f.mimetype.startsWith('image'));
    const videos = files.filter(f => f.mimetype.startsWith('video'));

    if (videos.length > 1) {
      return res.status(400).json({ error: "Only one video allowed" });
    }

    if (images.length > 5) {
      return res.status(400).json({ error: "Max 5 images allowed" });
    }

    // ✅ create post
    const newPost = await Post.create(
      req.user.id,
      content || '',
      visibility || 'public'
    );

    // 🔥 SAVE MEDIA (FIXED HERE)
    // for (let file of files) {
    //   const type = file.mimetype.startsWith('image') ? 'image' : 'video';

    //   // ✅ IMPORTANT CHANGE
    //   const mediaUrl = file.location;   // 🔥 S3 URL

    //   await Post.addMedia(newPost.id, mediaUrl, type);
    // }

for (let file of files) {
  const type = file.mimetype.startsWith('image') ? 'image' : 'video';

  // ✅ store only path
  await Post.addMedia(newPost.id, file.key, type);
}


    res.status(201).json({
      message: "Post created",
      postId: newPost.id
    });

  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// exports.getPost = async (req, res) => {
//   try {
//     const post = await Post.getById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     res.json(post);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getFeed = async (req, res) => {
//   try {
//     const posts = await Post.getFeed();

//     res.json({
//       posts
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.updatePost = async (req, res) => {
//   try {
//     const post = await Post.update(
//       req.params.id,
//       req.body.content,
//       req.body.visibility
//     );

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     res.json(post);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// exports.deletePost = async (req, res) => {
//   try {
//     await Post.delete(req.params.id);

//     res.json({ message: "Post deleted" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getPost = async (req, res) => {
  const post = await Post.getById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
};

exports.updatePost = async (req, res) => {
 const post = await Post.update(
    req.params.id,
    req.body.content,
    req.body.visibility
  );
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
};

exports.deletePost = async (req, res) => {
  await Post.delete(req.params.id);
  res.json({ message: "Post deleted" });
};

exports.getFeed = async (req, res) => {
  const posts = await Post.getFeed();
  res.json(posts);
};

exports.getUserPosts = async (req, res) => {
  const posts = await Post.getUserPosts(req.params.id);
  res.json(posts);
};