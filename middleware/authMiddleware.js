// const jwt = require("jsonwebtoken");
// const JWT = require("../config/jwt");

// module.exports = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   console.log(authHeader,'token')

//   if (!authHeader) {
//     console.log("Authorization header missing");
//     return res.status(401).json({ message: "Token missing" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     console.log(token,'verifytoken')
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decoded,'decoded')
//     req.user = {
//       id: decoded.userid,
//       role_id: decoded.role
//     };
//     next();
//   } catch (err) {
//   console.log(err)
//     return res.status(401).json({ message: "Token expired or invalid" });
//   }
// };

const jwt = require("jsonwebtoken");
const JWT = require("../config/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Use config secret
    const decoded = jwt.verify(token, JWT.secret);

    req.user = {
      id: decoded.id || decoded.userid,
      role_id: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token expired or invalid",
      error: err.message
    });
  }
};