const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (id, role = 'customer') => {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

module.exports = generateToken;
