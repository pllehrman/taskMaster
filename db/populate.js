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
    console.log('Users have been successfully seeded.')
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

    // Split users array into two halves
    const halfwayPoint = Math.ceil(usersArr.length / 2);
    const firstHalfUsers = usersArr.slice(0, halfwayPoint);
    const secondHalfUsers = usersArr.slice(halfwayPoint);

    // Assume jsonOrganizations is an array of organization data objects
    for (let i = 0; i < jsonOrganizations.length; i++) {
      const orgData = jsonOrganizations[i];
      
      // Determine which half of users should join this organization
      const usersToJoin = i < 6 ? firstHalfUsers : secondHalfUsers;

      // Set the first user of the relevant half as manager and founder
      orgData.manager = usersToJoin[0]._id;
      orgData.founder = usersToJoin[0]._id;

      // Add the first 5 users of the relevant half as members
      // This ensures the manager/founder, who is also the first user, is included
      orgData.members = usersToJoin.slice(0, 5).map(user => user._id);

      const organization = new Organization(orgData);
      await organization.save();
      organizations.push(organization); // Add the organization to the array
    }

    console.log('Organizations have been successfully created and users assigned.');
    return organizations; // Return the array of organizations
  } catch (err) {
    console.error('Error creating organizations:', err);
    process.exit(1);
  }
};


const seedTasks = async (users, organizations) => {
  try {
    await Task.deleteMany(); // Optional: Clear existing tasks if starting fresh

    for (const organization of organizations) {
      const tasksSubset = jsonTasks.sort(() => 0.5 - Math.random()).slice(0, Math.ceil(jsonTasks.length / 2));
      for (const taskData of tasksSubset) {
        // Filter users belonging to the current organization
        const orgUsers = users.filter(user => 
          organization.members.includes(user._id) || 
          organization.manager.equals(user._id) || 
          organization.founder.equals(user._id));

        // Ensure there are enough users for assigner and assignees
        if (orgUsers.length >= 3) {
          let assignerIndex, assignee1Index, assignee2Index;
          assignerIndex = Math.floor(Math.random() * orgUsers.length);

          do {
            assignee1Index = Math.floor(Math.random() * orgUsers.length);
          } while (assignee1Index === assignerIndex);

          do {
            assignee2Index = Math.floor(Math.random() * orgUsers.length);
          } while (assignee2Index === assignerIndex || assignee2Index === assignee1Index);

          // Create a new task with ObjectId casting for the current organization
          const newTaskData = {
            ...taskData,
            assigner: orgUsers[assignerIndex]._id,
            assignees: [
              orgUsers[assignee1Index]._id,
              orgUsers[assignee2Index]._id
            ],
            organization: organization._id
          };

          const newTask = new Task(newTaskData);
          await newTask.save();
        } else {
          console.warn(`Not enough users in organization ${organization.name} to create tasks.`);
        }
      }
    }

    console.log('All tasks have been successfully created for each organization.');
  } catch (err) {
    console.error('Error creating tasks:', err);
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
