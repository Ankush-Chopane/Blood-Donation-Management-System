const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BloodBank = require('../models/BloodBank');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { sendVerificationEmail, sendResetEmail } = require('../services/mailService');
const { createNotification } = require('../services/notificationService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  status: user.status,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

exports.register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    avatarUrl,
    bankDetails
  } = req.body;

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw new AppError('User already exists', 409);
  }

  const verificationToken = crypto.randomBytes(20).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    avatarUrl,
    verificationToken
  });

  if (role === 'bank') {
    try {
      const bloodBank = await BloodBank.create({
        user: user._id,
        name: bankDetails?.name || `${name} Blood Bank`,
        address: bankDetails?.address,
        city: bankDetails?.city,
        state: bankDetails?.state,
        pinCode: bankDetails?.pinCode,
        contactNumber: bankDetails?.contactNumber || phone,
        email,
        licenseNumber: bankDetails?.licenseNumber,
        verificationStatus: 'pending',
        status: 'inactive'
      });

      const admins = await User.find({ role: 'admin', status: 'active' }).select('_id');
      await Promise.all(
        admins.map((admin) => createNotification({
          user: admin._id,
          type: 'approval',
          title: 'New blood bank application',
          message: `${bloodBank.name} submitted a blood bank profile for verification.`,
          resourceType: 'BloodBank',
          resourceId: bloodBank._id
        }))
      );
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
  }

  await sendVerificationEmail(user.email, user.name, verificationToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: sanitizeUser(user),
      token: generateToken(user._id)
    }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: sanitizeUser(user),
      token: generateToken(user._id)
    }
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.status(204).send();
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user)
  });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'avatarUrl'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: sanitizeUser(user)
  });
});

exports.deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).send();
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw new AppError('Please provide a verification token', 400);
  }

  const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account verified successfully'
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError('No user registered with that email', 404);
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();

  await sendResetEmail(user.email, user.name, resetToken);

  res.status(200).json({
    success: true,
    message: 'Password reset link sent successfully'
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new AppError('Please provide a new password', 400);
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  }).select('+resetPasswordToken');

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
});
