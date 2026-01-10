const jwt = require("jsonwebtoken");
const JWT = require("../config/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT.SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token expired or invalid" });
  }
};
