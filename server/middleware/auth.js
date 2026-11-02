const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Accepts the token from the httpOnly cookie, or an "Authorization: Bearer <token>" header.
module.exports = async function protect(req, res, next) {
  let token = req.cookies && req.cookies.token;

  const header = req.headers.authorization;
  if (!token && header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
