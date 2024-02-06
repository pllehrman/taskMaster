require('dotenv').config();

const connectDB = require('./connect'); // Make sure this is your correct DB connection function
const User = require('../models/User'); // Import the User model
const jsonUsers = require('./sample_data/users.json');

const mongoose = require('mongoose')

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const userDocs = [];

    for (const userData of jsonUsers) {
        const user = new User(userData);
        user.fake = true; // Ensure 'fake' is a valid field in your User schema
        await user.save();
        userDocs.push(user);
    }
    console.log('Users have been successfully seeded.')
    return userDocs;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const startSeeding = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const users = await seedUsers();
    console.log('Success! Fake users have been seeded.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startSeeding();
