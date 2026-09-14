const mongoose = require('mongoose');
const { BLOOD_TYPES, PHONE_REGEX } = require('./constants');

const requestStatusLogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'matched', 'fulfilled', 'cancelled', 'expired']
    },
    note: {
      type: String,
      trim: true,
      maxlength: 250
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const bloodRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecipientProfile',
      index: true
    },
    assignedBloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      index: true
    },
    recipientName: {
      type: String,
      required: [true, 'Please add recipient name'],
      trim: true,
      maxlength: 80
    },
    bloodTypeNeeded: {
      type: String,
      required: [true, 'Please specify the needed blood type'],
      enum: BLOOD_TYPES,
      index: true
    },
    unitsNeeded: {
      type: Number,
      required: [true, 'Please specify units count'],
      default: 1,
      min: [1, 'Units needed must be at least 1'],
      max: [20, 'Units needed cannot exceed 20']
    },
    unitsFulfilled: {
      type: Number,
      default: 0,
      min: 0
    },
    hospitalName: {
      type: String,
      required: [true, 'Please add hospital name'],
      trim: true,
      maxlength: 120
    },
    city: {
      type: String,
      required: [true, 'Please add city location'],
      trim: true,
      maxlength: 80,
      index: true
    },
    contactPhone: {
      type: String,
      required: [true, 'Please add contact phone'],
      trim: true,
      match: [PHONE_REGEX, 'Please add a valid contact phone']
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    isEmergency: {
      type: Boolean,
      default: false,
      index: true
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 250
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    doctorName: {
      type: String,
      trim: true,
      maxlength: 80
    },
    medicalReferenceNumber: {
      type: String,
      trim: true,
      maxlength: 80
    },
    documentProofUrl: {
      type: String,
      trim: true,
      maxlength: 250
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'fulfilled', 'cancelled', 'expired'],
      default: 'pending',
      index: true
    },
    requestCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    neededBy: Date,
    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    statusHistory: {
      type: [requestStatusLogSchema],
      default: []
    },
    lastStatusUpdatedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

bloodRequestSchema.index({ status: 1, urgency: 1, bloodTypeNeeded: 1, city: 1, createdAt: -1 });
bloodRequestSchema.index({ recipient: 1, status: 1, createdAt: -1 });
bloodRequestSchema.index({ requestCode: 1 }, { unique: true, sparse: true });
bloodRequestSchema.index({ isEmergency: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
