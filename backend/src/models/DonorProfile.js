const mongoose = require('mongoose');
const { BLOOD_TYPES, PHONE_REGEX, PIN_CODE_REGEX } = require('./constants');

const donorProfileSchema = new mongoose.Schema(
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
    city: {
      type: String,
      required: [true, 'Please specify your city'],
      trim: true,
      maxlength: 80
    },
    pinCode: {
      type: String,
      required: [true, 'Please specify your PIN code'],
      trim: true,
      match: [PIN_CODE_REGEX, 'Please add a valid six-digit Indian PIN code']
    },
    state: {
      type: String,
      trim: true,
      maxlength: 80
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
      maxlength: 80
    },
    addressLine: {
      type: String,
      trim: true,
      maxlength: 200
    },
    contactNumber: {
      type: String,
      required: [true, 'Please specify your contact number'],
      trim: true,
      match: [PHONE_REGEX, 'Please add a valid contact number']
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (value) => !value || value.length === 2,
          message: 'Coordinates must contain longitude and latitude'
        }
      }
    },
    lastDonationDate: {
      type: Date,
      default: null
    },
    nextEligibleDate: Date,
    isEligible: {
      type: Boolean,
      default: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'temporarily_unavailable'],
      default: 'active',
      index: true
    },
    availability: {
      type: String,
      enum: ['available', 'on_call', 'unavailable'],
      default: 'available',
      index: true
    },
    totalDonations: {
      type: Number,
      min: 0,
      default: 0
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 250
    }
  },
  {
    timestamps: true
  }
);

donorProfileSchema.index({ bloodType: 1, city: 1, status: 1, isEligible: 1 });
donorProfileSchema.index({ bloodType: 1, availability: 1, approvalStatus: 1, city: 1 });
donorProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DonorProfile', donorProfileSchema);
