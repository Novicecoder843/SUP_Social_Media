const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log(authHeader,'token')
  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {

    console.log(token,'verifytoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded,'decoded')
    req.user = {
      id: decoded.userid,
      role_id: decoded.role
    };
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
