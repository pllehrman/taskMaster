require('dotenv').config();

const connectDB = require('./connect'); // Make sure this is your correct DB connection function
const User = require('../models/User'); // Import the User model
const Task = require('../models/Task');
const Organization = require('../models/Organization');

const jsonTasks = require('./sample_data/tasks.json');
const jsonOrganizations = require('./sample_data/organizations.json');
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
    return userDocs;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedOrganizations = async (usersArr) => {
  try {
    await Organization.deleteMany();
    let organizations = []; // Array to store the created organizations

    for (const orgData of jsonOrganizations) {
      randomUserIndex = Math.floor(Math.random() * usersArr.length);
      const randomUser = usersArr[randomUserIndex];
      orgData.manager = randomUser._id;
      orgData.founder = randomUser._id;

      let selectedIndices = new Set();
      while (selectedIndices.size < 5) {
        let randomIndex = Math.floor(Math.random() * usersArr.length);
        selectedIndices.add(randomIndex);
      }
      orgData.members = Array.from(selectedIndices).map(index => usersArr[index]._id);
      console.log(orgData)
      const organization = new Organization(orgData);
      await organization.save();
      organizations.push(organization); // Add the organization to the array
    };

    return organizations; // Return the array of organizations
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedTasks = async (users, organizations) => {
  try {
    for (const taskData of jsonTasks) {
      // Randomly select users for assigner and assignees, ensuring they are different
      let assignerIndex, assignee1Index, assignee2Index;
      assignerIndex = Math.floor(Math.random() * users.length);
      do {
        assignee1Index = Math.floor(Math.random() * users.length);
      } while (assignee1Index === assignerIndex);

      do {
        assignee2Index = Math.floor(Math.random() * users.length);
      } while (assignee2Index === assignerIndex || assignee2Index === assignee1Index);

      // Randomly select an organization
      const organizationIndex = Math.floor(Math.random() * organizations.length);

      // Create a new task with ObjectId casting
      const newTaskData = {
        ...taskData,
        assigner: users[assignerIndex]._id,
        assignees: [
          users[assignee1Index]._id,
          users[assignee2Index]._id
        ],
        organization: organizations[organizationIndex]._id
      };

      const newTask = new Task(newTaskData);
      await newTask.save();
    }

    console.log('All tasks have been successfully created.');
  } catch (err) {
    console.error('Error creating a task:', err);
    process.exit(1);
  }
};


const startSeeding = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const users = await seedUsers();
    const organizations = await seedOrganizations(users);
    await seedTasks(users, organizations);
    console.log('Success! Database seeded.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startSeeding();
