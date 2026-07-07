const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const setup = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodconnect';
  await mongoose.connect(uri);
  console.log('✅ Database connected');

  // ── 1. Delete personal/test users ────────────────────────────────────────
  const emailsToDelete = [
    'ankushchopane15@gmail.com',
    'youremail@gmail.com'
  ];
  for (const email of emailsToDelete) {
    const del = await User.findOneAndDelete({ email: email.toLowerCase() });
    if (del) {
      console.log(`🗑️  Deleted user: ${email}`);
    }
  }

  // ── 2. Seed the demo user ─────────────────────────────────────────────────
  const demoEmail = process.env.SEED_EMAIL;
  const demoPassword = process.env.SEED_PASSWORD;
  const demoName = process.env.SEED_NAME || 'Demo User';
  const demoRole = process.env.SEED_ROLE || 'admin';

  const existing = await User.findOne({ email: demoEmail.toLowerCase() });
  if (existing) {
    console.log(`ℹ️  Demo user already exists: ${demoEmail}`);
  } else {
    const user = await User.create({
      name: demoName,
      email: demoEmail.toLowerCase(),
      password: demoPassword,
      role: demoRole,
      isVerified: true,
      provider: 'local'
    });
    console.log('');
    console.log('🎉 Demo user created!');
    console.log('─────────────────────────────');
    console.log(`   Name  : ${user.name}`);
    console.log(`   Email : ${user.email}`);
    console.log(`   Pass  : ${demoPassword}`);
    console.log(`   Role  : ${user.role}`);
    console.log('─────────────────────────────');
  }

  await mongoose.connection.close();
  process.exit(0);
};

setup().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
