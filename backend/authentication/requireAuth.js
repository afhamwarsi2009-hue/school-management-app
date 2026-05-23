const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function readToken(req) {
  const authorization = req.headers.authorization || '';
  if (!authorization.toLowerCase().startsWith('bearer ')) return null;
  return authorization.slice(7).trim();
}

function requireAuth(roles = []) {
  return (req, res, next) => {
    const token = readToken(req);
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    try {
      const user = jwt.verify(token, env.jwtSecret);
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

function optionalAuth() {
  return (req, res, next) => {
    const token = readToken(req);
    if (!token) return next();

    try {
      req.user = jwt.verify(token, env.jwtSecret);
    } catch {
      req.user = null;
    }

    return next();
  };
}

module.exports = { requireAuth, optionalAuth };
