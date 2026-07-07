const mongoose = require('mongoose');
const { BLOOD_TYPES } = require('./constants');

const donationHistorySchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    donorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonorProfile',
      index: true
    },
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      required: true,
      index: true
    },
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    bloodType: {
      type: String,
      required: [true, 'Please specify blood type of donation'],
      enum: BLOOD_TYPES,
      index: true
    },
    unitsDonated: {
      type: Number,
      required: [true, 'Please specify units donated'],
      default: 1,
      min: [1, 'Units donated must be at least 1'],
      max: [10, 'Units donated cannot exceed 10']
    },
    donationDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'screening', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000
    },
    appointmentDate: Date,
    approvedAt: Date
  },
  {
    timestamps: true
  }
);

donationHistorySchema.index({ donor: 1, donationDate: -1 });
donationHistorySchema.index({ bloodBank: 1, donationDate: -1 });
donationHistorySchema.index({ status: 1, donationDate: -1 });

module.exports = mongoose.model('DonationHistory', donationHistorySchema);
