require('dotenv').config();
const jwt = require('jsonwebtoken');

const authentificationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'You are not authorized to get in'});
  };
  try {
    const token = authHeader.split(' ').pop();
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const { id, name } = decodedToken;
    req.user = { id, name };
    next();
  } catch (error) {
    throw error;
  };
};

module.exports = authentificationMiddleware;