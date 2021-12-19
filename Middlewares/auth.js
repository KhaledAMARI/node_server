require('dotenv').config();
const jwt = require('jsonwebtoken');
const userModel = require('../Models/user');

const authentificationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'You are not authorized to get in'});
  };
  try {
    const token = authHeader.split(' ').pop();
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById({ _id: decodedToken.userID}).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User Not Found'});
    };
    req.user = user;
    next();
  } catch (error) {
    throw error;
  };
};

module.exports = authentificationMiddleware;