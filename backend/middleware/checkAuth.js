const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const result = jwt.verify(token, process.env.JWT_KEY);
    req.body.USER_email = result.email;
    req.body.USER_username = result.username;
    req.body.userId = result.userId;
    next();
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
};

module.exports = checkAuth;
