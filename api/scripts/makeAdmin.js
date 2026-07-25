require('dotenv').config({ path: '../.env' }); // Load .env from api/
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dasyl';

async function makeAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <user-email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log(`User not found with email: ${email}`);
    } else {
      console.log(`Successfully elevated ${email} to admin role!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAdmin();
