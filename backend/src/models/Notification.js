const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['alert', 'info', 'request', 'inventory', 'donation', 'appointment', 'approval'],
      default: 'info',
      index: true
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120
    },
    message: {
      type: String,
      required: [true, 'Please add a notification message'],
      trim: true,
      maxlength: 1000
    },
    resourceType: {
      type: String,
      enum: ['BloodRequest', 'DonationHistory', 'Inventory', 'BloodBank', 'Appointment', 'DonorProfile', null],
      default: null
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: Date,
    deliveryStatus: {
      type: String,
      enum: ['queued', 'sent', 'failed', 'read'],
      default: 'queued',
      index: true
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
