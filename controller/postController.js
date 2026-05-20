const pool = require("../config/db");
const PostModel = require("../models/postModel");
const hashtagModel = require("../models/hashtagModel");

//CREATE POST (with media)
exports.createPost = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const user_id = req.user.id;
    const { content, location_id, hashtags, tagged_users, visibility, allow_comments, allow_share } = req.body;

    const postResult = await PostModel.createPost(client, user_id, content, 
      location_id, visibility, allow_comments, allow_share);
    const post = postResult.rows[0];

//     //Prepare media list
//     let mediaList = [];

//     if (req.files && req.files.length > 0) {
//       mediaList = req.files.map((file, index) => ({
//         url: file.location || file.key,
//         type: file.mimetype.startsWith("video") ? "video" : "image",
//         order: index
//       }));
//       const mediaDBList = req.files.map((file, index) => ({
//     url: file.key || file.location,
//     type: file.mimetype.startsWith("video") ? "video" : "image",
//     order: index
//   }));

//   console.log("MEDIA DB LIST:", mediaDBList);

//    //Insert media
//       await PostModel.addPostMediaBulk(client, post.id,mediaDBList);
//       mediaList = req.files.map((file, index) => ({
//     url: file.location || file.key,
//     type: file.mimetype.startsWith("video")
//       ? "video"
//       : "image",
//     order: index
//   }));
// }

let mediaList = [];

if (req.files && req.files.length > 0) {

  const mediaDBList = req.files.map((file, index) => {

    const mediaUrl =
      file.location ||
      file.path ||
      file.filename ||
      file.key;

    if (!mediaUrl) {
      throw new Error("Media URL missing");
    }

    return {
      url: mediaUrl,
      type: file.mimetype.startsWith("video")
        ? "video"
        : "image",
      order: index
    };
  });

  console.log("MEDIA DB LIST:", mediaDBList);

  await PostModel.addPostMediaBulk(
    client,
    post.id,
    mediaDBList
  );

  mediaList = mediaDBList;
}
  
    // HASHTAGS
    if (hashtags) {

      const hashtagArray = hashtags ? JSON.parse(hashtags) : [];

        await PostModel.addPostHashtagsBulk (
          client,
          post.id,
          hashtagArray
        );
    }

    // TAGGED USERS
    if (tagged_users) {

      const taggedArray = tagged_users ? JSON.parse(tagged_users) : [];
     
        await PostModel.addTaggedUsersBulk(
          client,
          post.id,
          taggedArray
        );
    }

    await client.query("COMMIT");

    console.log("COMMENT DONE");

    const fullPost = await PostModel.getSinglePostFull(
      post.id,
      user_id
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      // data: fullPost.rows[0]
      data: {
        ...post,
        location_id,
        hashtags,
        tagged_users,
        media: mediaList
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error creating post"
    });
  } finally {
    client.release();
  }
};

// GET ALL POSTS (FEED)
exports.getAllPosts = async (req, res) => {
  try {
    const result = await PostModel.getAllPosts();

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching posts"
    });
  }
};

// GET SINGLE POST
exports.getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const result = await PostModel.getSinglePostFull(postId, userId);

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error("err");
    res.status(500).json({
      success: false,
      message: "Error fetching post"
    });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user.id;

    const result = await PostModel.updatePost(
      req.params.id,
      user_id,
      content
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error("err");
    res.status(500).json({
      success: false,
      message: "Error updating post"
    });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const user_id = req.user.id;

    await PostModel.deletePost(req.params.id, user_id);

    res.status(200).json({
      success: true,
      message: "Post deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting post"
    });
  }
};

// USER POSTS
exports.getUserPosts = async (req, res) => {
  try {
    const user_id = req.params.id;

    const result = await PostModel.getUserPosts(user_id);

    // format response
    const formatted = result.rows.map(post => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at,

      user: {
        id: post.user_id,
        name: post.name
      },

      media: post.media,
      likes_count: Number(post.likes_count),
      comments_count: Number(post.comments_count),
      shares_count: Number(post.shares_count)
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};