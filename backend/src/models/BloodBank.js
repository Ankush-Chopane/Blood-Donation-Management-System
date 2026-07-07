const mongoose = require('mongoose');
const { BLOOD_TYPES, PHONE_REGEX, ZIP_CODE_REGEX } = require('./constants');

const inventorySummaryShape = BLOOD_TYPES.reduce((shape, type) => {
  shape[type] = {
    type: Number,
    default: 0,
    min: [0, `${type} units cannot be negative`]
  };
  return shape;
}, {});

const bloodBankSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please add blood bank name'],
      trim: true,
      maxlength: 120
    },
    address: {
      type: String,
      required: [true, 'Please add address'],
      trim: true,
      maxlength: 200
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
      trim: true,
      maxlength: 80,
      index: true
    },
    state: {
      type: String,
      trim: true,
      maxlength: 80
    },
    zipCode: {
      type: String,
      trim: true,
      match: [ZIP_CODE_REGEX, 'Please add a valid zip code']
    },
    contactNumber: {
      type: String,
      required: [true, 'Please add contact number'],
      trim: true,
      match: [PHONE_REGEX, 'Please add a valid contact number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    licenseNumber: {
      type: String,
      trim: true,
      maxlength: 60
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (value) => !value || value.length === 2,
          message: 'Coordinates must contain longitude and latitude'
        }
      }
    },
    inventory: inventorySummaryShape,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bloodBankSchema.index({ name: 1, city: 1 }, { unique: true });
bloodBankSchema.index({ location: '2dsphere' });

bloodBankSchema.virtual('inventoryItems', {
  ref: 'Inventory',
  localField: '_id',
  foreignField: 'bloodBank'
});

module.exports = mongoose.model('BloodBank', bloodBankSchema);
