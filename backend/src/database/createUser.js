const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const createUser = async () => {
  const email = process.env.SEED_EMAIL;
  const password = process.env.SEED_PASSWORD;
  const name = process.env.SEED_NAME || 'Admin User';
  const role = process.env.SEED_ROLE || 'admin';

  if (!email || !password) {
    console.error('❌ Please set SEED_EMAIL and SEED_PASSWORD in your .env file');
    process.exit(1);
  }

  const validRoles = ['donor', 'recipient', 'bank', 'admin'];
  if (!validRoles.includes(role)) {
    console.error(`❌ Invalid SEED_ROLE. Must be one of: ${validRoles.join(', ')}`);
    process.exit(1);
  }

  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodconnect';
    await mongoose.connect(uri);
    console.log('✅ Database connected');

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`⚠️  A user with email "${email}" already exists.`);
      console.log(`   Name: ${existing.name} | Role: ${existing.role}`);
      console.log('   You can now log in with this email and your existing password.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create the user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      isVerified: true,
      provider: 'local'
    });

    console.log('');
    console.log('🎉 User created successfully!');
    console.log('─────────────────────────────');
    console.log(`   Name  : ${user.name}`);
    console.log(`   Email : ${user.email}`);
    console.log(`   Role  : ${user.role}`);
    console.log('─────────────────────────────');
    console.log('👉 You can now log in at http://localhost:5173/login');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create user:', err.message);
    process.exit(1);
  }
};

createUser();
