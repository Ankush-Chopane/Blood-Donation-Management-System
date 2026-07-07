const mongoose = require('mongoose');
const { BLOOD_TYPES } = require('./constants');

const inventorySchema = new mongoose.Schema(
  {
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      required: true,
      index: true
    },
    sourceDonation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonationHistory'
    },
    reservedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest'
    },
    bloodType: {
      type: String,
      required: [true, 'Please specify blood group'],
      enum: BLOOD_TYPES,
      index: true
    },
    component: {
      type: String,
      enum: ['whole_blood', 'packed_rbc', 'plasma', 'platelets', 'cryoprecipitate'],
      default: 'whole_blood',
      index: true
    },
    units: {
      type: Number,
      required: [true, 'Please specify draw units count'],
      min: [1, 'Draw units count must be at least 1 pint'],
      max: [20, 'Draw units count cannot exceed 20 units'],
      default: 1
    },
    batchNumber: {
      type: String,
      required: [true, 'Please specify draw batch identification'],
      trim: true,
      maxlength: 60
    },
    drawDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please specify expiry date'],
      validate: {
        validator: function validator(value) {
          return !this.drawDate || value > this.drawDate;
        },
        message: 'Expiry date must be after draw date'
      }
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'quarantined', 'transfused', 'discarded'],
      default: 'available',
      index: true
    },
    storageLocation: {
      type: String,
      trim: true,
      maxlength: 80
    },
    testedAt: Date,
    lowStockThreshold: {
      type: Number,
      min: 0,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

// Auto-index batch searches
inventorySchema.index({ bloodBank: 1, bloodType: 1, status: 1 });
inventorySchema.index({ bloodBank: 1, batchNumber: 1 }, { unique: true });
inventorySchema.index({ status: 1, expiryDate: 1 });
inventorySchema.index({ bloodBank: 1, component: 1, status: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
