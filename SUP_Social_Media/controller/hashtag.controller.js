const Hashtag = require('../models/hashtag.model');

exports.searchHashtags = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        error: "Query required"
      });
    }

    const tags = await Hashtag.search(q);

    res.json(tags);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const tags = await Hashtag.trending();

    res.json(tags);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.tag;

    const posts = await Hashtag.getPosts(tag);

    res.json({
      hashtag: tag,
      posts
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};