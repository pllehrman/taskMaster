require('dotenv').config();

const connectDB = require('./connect'); // Make sure this is your correct DB connection function
const User = require('../models/User'); // Import the User model
const Task = require('../models/Task');
const Organization = require('../models/Organization');

const jsonTasks = require('./sample_data/tasks.json');
const jsonOrganizations = require('./sample_data/organizations.json');
const jsonUsers = require('./sample_data/users.json');

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
    return userDocs;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedOrganizations = async (usersArr) => {
  try {
    await Organization.deleteMany();
    for (const orgData of jsonOrganizations) {

      randomUserIndex = Math.floor(Math.random (usersArr.length));
      const randomUser = usersArr[randomUserIndex];

      orgData.manager = randomUser._id 
      orgData.founder = randomUser._id

      orgData.members = usersArr.map(user => user._id)

      const organization = new Organization(orgData);
      await organization.save();
    };
    // Add additional logic here if you need to link organizations with users
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedTasks = async () => {
  try {
    await Task.deleteMany();
    await Task.create(jsonTasks);
    console.log('Success! Database seeded.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const startSeeding = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const users = await seedUsers();
    await seedOrganizations(users);
    await seedTasks();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startSeeding();
