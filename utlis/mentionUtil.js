exports.extractMentions = (text) => {
  const matches = text.match(/@\w+/g);
  if (!matches) return [];

  return matches.map(m => m.replace("@", "").toLowerCase());
};