const { EMAIL_REGEX, USER_ROLES } = require('../models/constants');
const AppError = require('../utils/appError');

const PUBLIC_REGISTRATION_ROLES = ['donor', 'recipient', 'bank'];

const validateRegisterInput = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return next(new AppError('Please provide name, email, password, and account role', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  if (!USER_ROLES.includes(role)) {
    return next(new AppError(`Role must be one of: ${USER_ROLES.join(', ')}`, 400));
  }

  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
    return next(new AppError('This account role cannot be self-registered', 403));
  }

  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide both email and password', 400));
  }

  next();
};

module.exports = { validateRegisterInput, validateLoginInput };
