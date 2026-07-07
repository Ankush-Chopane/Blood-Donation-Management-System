const mongoose = require('mongoose');
const { BLOOD_TYPES, PHONE_REGEX, ZIP_CODE_REGEX } = require('./constants');

const recipientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    bloodType: {
      type: String,
      required: [true, 'Please specify your blood type'],
      enum: BLOOD_TYPES,
      index: true
    },
    contactNumber: {
      type: String,
      required: [true, 'Please specify contact details'],
      trim: true,
      match: [PHONE_REGEX, 'Please add a valid contact number']
    },
    medicalHistory: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000
    },
    hospitalName: {
      type: String,
      trim: true,
      maxlength: 120
    },
    city: {
      type: String,
      required: [true, 'Please specify your city'],
      trim: true,
      maxlength: 80
    },
    zipCode: {
      type: String,
      required: [true, 'Please specify your zip code'],
      trim: true,
      match: [ZIP_CODE_REGEX, 'Please add a valid zip code']
    },
    emergencyContactName: {
      type: String,
      trim: true,
      maxlength: 80
    },
    emergencyContactPhone: {
      type: String,
      trim: true,
      match: [PHONE_REGEX, 'Please add a valid emergency contact number']
    }
  },
  {
    timestamps: true
  }
);

recipientProfileSchema.index({ city: 1, bloodType: 1 });

module.exports = mongoose.model('RecipientProfile', recipientProfileSchema);
