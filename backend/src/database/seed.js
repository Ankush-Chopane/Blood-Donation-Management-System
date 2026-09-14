const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables using absolute path relative to this file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const BloodBank = require('../models/BloodBank');
const DonorProfile = require('../models/DonorProfile');
const RecipientProfile = require('../models/RecipientProfile');
const BloodRequest = require('../models/BloodRequest');
const Inventory = require('../models/Inventory');
const Appointment = require('../models/Appointment');
const DonationHistory = require('../models/DonationHistory');
const Notification = require('../models/Notification');

const resetRequested = process.argv.includes('--reset');

const seedDB = async () => {
  try {
    if (!resetRequested) {
      console.log('Seed cancelled: this command would replace existing database data.');
      console.log('Use "npm run seed:reset" only when you intentionally want to clear and recreate the development database.');
      process.exit(0);
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodconnect';
    console.log(`Connecting to database at: ${uri}`);
    await mongoose.connect(uri);
    console.log('Database connected successfully for seeding.');

    // 1. Clear existing database collections
    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      BloodBank.deleteMany(),
      DonorProfile.deleteMany(),
      RecipientProfile.deleteMany(),
      BloodRequest.deleteMany(),
      Inventory.deleteMany(),
      Appointment.deleteMany(),
      DonationHistory.deleteMany(),
      Notification.deleteMany()
    ]);
    console.log('Database cleared.');

    // 1. Create Users
    console.log('Seeding users...');
    await User.create({
      name: 'Ankush System Admin',
      email: 'admin@bloodconnect.com',
      password: 'password123',
      role: 'admin',
      phone: '+919309538757',
      isVerified: true
    });

    console.log('Users created.');

    console.log('----------------------------------------------------');
    console.log('Database Seeding Completed Successfully!');
    console.log('Accounts Available for Login:');
    console.log('1. Admin:      admin@bloodconnect.com / password123');
    console.log('----------------------------------------------------');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error.message);
    process.exit(1);
  }
};

seedDB();
