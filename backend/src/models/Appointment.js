const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
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
      required: true,
      index: true
    },
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      required: true,
      index: true
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide an appointment date']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
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

appointmentSchema.index({ donor: 1, appointmentDate: -1 });
appointmentSchema.index({ bloodBank: 1, appointmentDate: 1, status: 1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
