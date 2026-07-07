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

const seedDB = async () => {
  try {
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

    // 2. Create Users
    console.log('Seeding users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@bloodconnect.com',
      password: 'password123',
      role: 'admin',
      phone: '+919876543210',
      isVerified: true
    });

    const donorUser = await User.create({
      name: 'Aniket Sharma',
      email: 'donor@bloodconnect.com',
      password: 'password123',
      role: 'donor',
      phone: '+919998887776',
      isVerified: true
    });

    const recipientUser = await User.create({
      name: 'Pooja Patel',
      email: 'recipient@bloodconnect.com',
      password: 'password123',
      role: 'recipient',
      phone: '+918887776665',
      isVerified: true
    });

    const bankUser = await User.create({
      name: 'Red Cross Manager',
      email: 'bank@bloodconnect.com',
      password: 'password123',
      role: 'bank',
      phone: '+917776665554',
      isVerified: true
    });
    console.log('Users created.');

    // 3. Create Blood Banks
    console.log('Seeding blood banks...');
    const bloodBank = await BloodBank.create({
      user: bankUser._id,
      name: 'Red Cross Donor Center',
      address: '100 Harrison St.',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94102',
      contactNumber: '+18007332767',
      email: 'sf-redcross@example.com',
      licenseNumber: 'LIC-SF-RC-98442',
      location: {
        type: 'Point',
        coordinates: [-122.3999, 37.7888]
      },
      inventory: {
        'O+': 45,
        'O-': 8,
        'A+': 15,
        'A-': 5,
        'B+': 12,
        'B-': 3,
        'AB+': 7,
        'AB-': 2
      }
    });

    const secondBank = await BloodBank.create({
      name: 'Bay Area Blood Repository',
      address: '450 Sutter St.',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94108',
      contactNumber: '+14155550144',
      email: 'sf-repository@example.com',
      licenseNumber: 'LIC-SF-BR-12345',
      location: {
        type: 'Point',
        coordinates: [-122.4085, 37.7895]
      },
      inventory: {
        'O+': 35,
        'O-': 12,
        'A+': 25,
        'A-': 8,
        'B+': 18,
        'B-': 4,
        'AB+': 10,
        'AB-': 3
      }
    });
    console.log('Blood banks created.');

    // 4. Create Donor Profile
    console.log('Seeding donor profile...');
    const donorProfile = await DonorProfile.create({
      user: donorUser._id,
      bloodType: 'O+',
      city: 'San Francisco',
      zipCode: '94102',
      state: 'California',
      country: 'USA',
      addressLine: '123 Mission St.',
      contactNumber: '+919998887776',
      location: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749]
      },
      lastDonationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago
      nextEligibleDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Eligible 10 days ago
      isEligible: true,
      status: 'active',
      availability: 'available',
      totalDonations: 4,
      approvalStatus: 'approved',
      approvedBy: adminUser._id,
      approvedAt: new Date()
    });
    console.log('Donor profile created.');

    // 5. Create Recipient Profile
    console.log('Seeding recipient profile...');
    const recipientProfile = await RecipientProfile.create({
      user: recipientUser._id,
      bloodType: 'A+',
      contactNumber: '+918887776665',
      medicalHistory: 'Chronic anemia, requires periodic transfusions.',
      hospitalName: 'San Francisco General Hospital',
      city: 'San Francisco',
      zipCode: '94110',
      emergencyContactName: 'Karan Patel',
      emergencyContactPhone: '+919998889998'
    });
    console.log('Recipient profile created.');

    // 6. Seed Inventory Items
    console.log('Seeding inventory items...');
    const now = new Date();
    await Inventory.insertMany([
      {
        bloodBank: bloodBank._id,
        bloodType: 'O+',
        component: 'whole_blood',
        units: 20,
        batchNumber: 'BATCH-O-POS-101',
        drawDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'available',
        storageLocation: 'Fridge-A1'
      },
      {
        bloodBank: bloodBank._id,
        bloodType: 'O+',
        component: 'platelets',
        units: 15,
        batchNumber: 'BATCH-O-POS-102',
        drawDate: new Date(),
        expiryDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // Expirying soon
        status: 'available',
        storageLocation: 'Agitator-B2'
      },
      {
        bloodBank: bloodBank._id,
        bloodType: 'O-',
        component: 'whole_blood',
        units: 8,
        batchNumber: 'BATCH-O-NEG-201',
        drawDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        status: 'available',
        storageLocation: 'Fridge-A2'
      },
      {
        bloodBank: bloodBank._id,
        bloodType: 'AB-',
        component: 'plasma',
        units: 2,
        batchNumber: 'BATCH-AB-NEG-301',
        drawDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(now.getTime() + 300 * 24 * 60 * 60 * 1000),
        status: 'available',
        storageLocation: 'Freezer-C1'
      }
    ]);
    console.log('Inventory items created.');

    // 7. Seed Blood Requests
    console.log('Seeding blood requests...');
    const request1 = await BloodRequest.create({
      requestedBy: recipientUser._id,
      recipient: recipientProfile._id,
      recipientName: 'Pooja Patel',
      bloodTypeNeeded: 'A+',
      unitsNeeded: 3,
      unitsFulfilled: 0,
      hospitalName: 'San Francisco General Hospital',
      city: 'San Francisco',
      contactPhone: '+918887776665',
      urgency: 'critical',
      isEmergency: true,
      status: 'pending',
      requestCode: 'REQ-CRIT-992',
      neededBy: new Date(now.getTime() + 24 * 60 * 60 * 1000), // tomorrow
      notes: 'Emergency platelet transfusion needed due to active bleeding.',
      statusHistory: [
        {
          status: 'pending',
          note: 'Request created by recipient',
          updatedAt: new Date()
        }
      ]
    });

    const request2 = await BloodRequest.create({
      requestedBy: recipientUser._id,
      recipient: recipientProfile._id,
      recipientName: 'Pooja Patel',
      bloodTypeNeeded: 'O+',
      unitsNeeded: 2,
      unitsFulfilled: 2,
      hospitalName: 'UCSF Medical Center',
      city: 'San Francisco',
      contactPhone: '+918887776665',
      urgency: 'medium',
      isEmergency: false,
      status: 'fulfilled',
      requestCode: 'REQ-NORM-104',
      neededBy: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      notes: 'Scheduled surgery support. Fulfilled by Red Cross Center.',
      statusHistory: [
        {
          status: 'pending',
          note: 'Request created',
          updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'matched',
          note: 'Matched with Red Cross Inventory',
          updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'fulfilled',
          note: 'Units delivered and transfused successfully.',
          updatedAt: new Date()
        }
      ]
    });
    console.log('Blood requests created.');

    // 8. Seed Appointments
    console.log('Seeding appointments...');
    await Appointment.create({
      donor: donorUser._id,
      donorProfile: donorProfile._id,
      bloodBank: bloodBank._id,
      appointmentDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      status: 'pending',
      notes: 'I prefer mornings if possible.'
    });
    console.log('Appointments created.');

    // 9. Seed Donation History
    console.log('Seeding donation histories...');
    await DonationHistory.create({
      donor: donorUser._id,
      donorProfile: donorProfile._id,
      bloodBank: bloodBank._id,
      bloodType: 'O+',
      unitsDonated: 1,
      donationDate: new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000),
      status: 'approved',
      approvedAt: new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000),
      notes: 'Screening passed. Healthy whole blood draw.'
    });
    console.log('Donation histories created.');

    // 10. Seed Notifications
    console.log('Seeding notifications...');
    await Notification.insertMany([
      {
        user: donorUser._id,
        type: 'approval',
        title: 'Donor Profile Approved',
        message: 'Your donor profile has been verified and approved by administrators. You are now active in the matching directory.',
        resourceType: 'DonorProfile',
        resourceId: donorProfile._id,
        isRead: false
      },
      {
        user: donorUser._id,
        type: 'request',
        title: 'Emergency Blood Request Nearby',
        message: `Urgent O+ blood request by Pooja Patel at UCSF Medical Center.`,
        resourceType: 'BloodRequest',
        resourceId: request2._id,
        isRead: false
      },
      {
        user: recipientUser._id,
        type: 'request',
        title: 'Request REQ-NORM-104 Fulfilled',
        message: 'Your request for 2 units of O+ has been completed successfully.',
        resourceType: 'BloodRequest',
        resourceId: request2._id,
        isRead: true
      }
    ]);
    console.log('Notifications created.');

    console.log('----------------------------------------------------');
    console.log('Database Seeding Completed Successfully!');
    console.log('Accounts Available for Login:');
    console.log('1. Admin:      admin@bloodconnect.com / password123');
    console.log('2. Donor:      donor@bloodconnect.com / password123');
    console.log('3. Recipient:  recipient@bloodconnect.com / password123');
    console.log('4. Blood Bank: bank@bloodconnect.com / password123');
    console.log('----------------------------------------------------');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error.message);
    process.exit(1);
  }
};

seedDB();
