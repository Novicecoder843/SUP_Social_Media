const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role_id: decoded.role_id
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
