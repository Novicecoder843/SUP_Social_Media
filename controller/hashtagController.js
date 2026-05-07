const hashtagModel = require("../models/hashtagModel");

// ✅ Add hashtags
exports.addHashtags = async (req, res) => {
  const { id: postId } = req.params;
  const { tags } = req.body;

  try {
    for (let tag of tags) {
      const hashtag = await hashtagModel.createOrGetHashtag(tag);
      await postHashtagModel.linkPostHashtag(postId, hashtag.id);
    }

    res.status(201).json({ message: "Hashtags added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding hashtags" });
  }
};

// ✅ Get hashtags of post
exports.getPostHashtags = async (req, res) => {
  const { id: postId } = req.params;

  try {
    const hashtags = await hashtagModel.getHashtagsByPost(postId);

    res.status(200).json({ postId, hashtags });

  } catch (error) {
    console.log(error); 

    res.status(500).json({ message: "Error fetching hashtags" });
  }
};

// ✅ Get posts by hashtag
exports.getPostsByHashtag = async (req, res) => {
  const { tag } = req.params;

  try {
    const posts = await hashtagModel.getPostsByTag(tag);

    res.status(200).json({ tag, posts });

  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};