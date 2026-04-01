const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token missing"
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ VERY IMPORTANT
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      error: "Invalid token"
    });
  }
};

exports.verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  const token = auth.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};



// const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // 🔥 VERY IMPORTANT
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};





