// utils/hashtagUtil.js

exports.extractHashtags = (text) => {
  const matches = text.match(/#\w+/g);
  if (!matches) return [];

  return matches.map(tag => tag.replace("#", "").toLowerCase());
};