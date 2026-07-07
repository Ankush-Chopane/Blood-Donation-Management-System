const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { EMAIL_REGEX, PHONE_REGEX, USER_ROLES } = require('./constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Please add a valid email']
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 128,
      select: false
    },
    googleId: {
      type: String,
      select: false
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'donor',
      index: true
    },
    phone: {
      type: String,
      trim: true,
      match: [PHONE_REGEX, 'Please add a valid phone number']
    },
    avatarUrl: {
      type: String,
      trim: true,
      maxlength: 500
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
      index: true
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    verificationToken: {
      type: String,
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpire: Date,
    lastLoginAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.index({ role: 1, status: 1 });

// Require password for local provider only
userSchema.pre('validate', function(next) {
  if (this.provider === 'local' && !this.password) {
    this.invalidate('password', 'Please add a password');
  }
  next();
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.virtual('donorProfile', {
  ref: 'DonorProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

userSchema.virtual('recipientProfile', {
  ref: 'RecipientProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

userSchema.virtual('managedBloodBank', {
  ref: 'BloodBank',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

module.exports = mongoose.model('User', userSchema);
