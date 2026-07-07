const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  deleteMe,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.delete('/me', protect, deleteMe);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);



module.exports = router;
