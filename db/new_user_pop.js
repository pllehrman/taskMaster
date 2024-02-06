require('dotenv').config();

const connectDB = require('./connect'); // Make sure this is your correct DB connection function
const User = require('../models/User'); // Import the User model
const Task = require('../models/Task');
const Organization = require('../models/Organization');

const jsonTasks = require('./sample_data/tasks.json');
const jsonOrganizations = require('./sample_data/organizations.json');

const mongoose = require('mongoose')

const seedOrganizations = async (usersArr, current_user_id, demo_id) => {
  try {
    let organizations = []; // Array to store the created organizations

    // Function to get an array of 5 unique random users from usersArr
    const getRandomUsers = (users, count) => {
      let shuffled = users.slice().sort(() => 0.5 - Math.random()); // Shuffle the array
      return shuffled.slice(0, count); // Get first `count` users
    };

    // Assume jsonOrganizations is an array of organization data objects
    for (let i = 0; i < jsonOrganizations.length; i++) {
      const orgData = jsonOrganizations[i];

      // Get a random group of 5 users for this organization
      const randomUsers = getRandomUsers(usersArr, 5);

      if (i < 4) {
        randomUsers.push(current_user_id)
      }

      // Optionally, set the first random user as manager and founder
      orgData.manager = randomUsers[0]._id;
      orgData.founder = randomUsers[0]._id;

      const validUsers = randomUsers.filter(user => user !== undefined);  // filter out invalid users

      orgData.members = validUsers.map(user => user._id);

      const organization = new Organization(orgData);
      if (!demo_id) {
        organization.demo_id = '1234';
      } else {
        organization.demo_id = demo_id;
      }
      await organization.save();
      organizations.push(organization); // Add the organization to the array
    }

    if (organizations.length >= 4) {
        // Only proceed if there are at least 4 organizations
        for (let i = 0; i < usersArr.length; i++) {
          const user = usersArr[i];
          for (let j = 0; j < 4; j++) {
            // Directly add user._id to the first four organizations' members array
            if (!organizations[j].members.includes(user._id)) {
              organizations[j].members.push(user._id);
              await organizations[j].save(); // Save each organization after modifying its members array
            }
          }
        }
      }

    console.log('Organizations have been successfully created and users assigned.');
    return organizations; // Return the array of organizations
  } catch (err) {
    console.error('Error creating organizations:', err);
    process.exit(1);
  }
};

const seedTasks = async (demo_id, current_user_id) => {
  try {

        // Fetch all organizations for the demo
        const organizations = await Organization.find({ 
          demo_id: demo_id, 
          members: current_user_id
         }).populate('members');

        for (const organization of organizations) {
        // Directly use populated members from the organization
        const orgUsers = organization.members; 

        // Check if there are enough users to assign tasks dynamically
        if (orgUsers.length >= 3) {
            const tasksSubset = jsonTasks.sort(() => 0.5 - Math.random()).slice(0, Math.ceil(jsonTasks.length / 4));

            for (const taskData of tasksSubset) {
            // Randomly select assigner and assignees from orgUsers
            let assignerIndex, assignee1Index, assignee2Index;
            assignerIndex = Math.floor(Math.random() * orgUsers.length);

            do {
                assignee1Index = Math.floor(Math.random() * orgUsers.length);
            } while (assignee1Index === assignerIndex);

            do {
                assignee2Index = Math.floor(Math.random() * orgUsers.length);
            } while (assignee2Index === assignerIndex || assignee2Index === assignee1Index);

            // Generate dynamic dates for time_assigned and time_deadline
            const assignedDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
            const deadlineDate = new Date(assignedDate.getTime() + Math.floor(Math.random() * 15 + 1) * 24 * 60 * 60 * 1000);

            // Create and save the new task
            const newTask = new Task({
                ...taskData,
                assigner: orgUsers[assignerIndex]._id,
                assignees: [orgUsers[assignee1Index]._id, orgUsers[assignee2Index]._id],
                organization: organization._id,
                time_assigned: assignedDate,
                time_deadline: deadlineDate,
                demo_id: demo_id
            });

            await newTask.save();
            }
        }   
        else {
          console.warn(`Not enough users in organization ${organization.name} to create tasks.`);
        }
    }

    console.log('All tasks have been successfully created for each organization.');
  } catch (err) {
    console.error('Error creating tasks:', err);
    process.exit(1);
  }
};

const seedNewUser = async (current_user_id, demo_id) => {
  try {
    await connectDB(process.env.MONGO_URI);
    const users = await User.find({fake: true}); // finding the sample users
    await seedOrganizations(users, current_user_id, demo_id);
    await seedTasks(demo_id, current_user_id);
    console.log('Success. Database seeded.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = {seedNewUser};


