const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const formatResponse = (success, data, error = null) => {
  const response = { success };
  if (success) {
    response.data = data;
  } else {
    response.error = error;
  }
  return response;
};

module.exports = { generateToken, formatResponse };
