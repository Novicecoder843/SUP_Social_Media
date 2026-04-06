const authorizeRole = (role_id) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    if (req.user.role_id !== role_id) {
      return res.status(403).send("Access denied");
    }

    next();
  };
};

module.exports = authorizeRole;