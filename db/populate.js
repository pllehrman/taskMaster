require('dotenv').config();

const connectDB = require('./connect')

const Task = require('../models/Task')
const Organization = require('../models/Organization')
const User = require('../models/User');

const jsonTasks = require('./sample_data/tasks.json')
const jsonOrganizations = require('./sample_data/organizations.json');
const jsonUsers = require('./sample_data/users.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI) //await connection to the db

    //Clearing house (db); note order is important due to references.
    await User.deleteMany()
    await Task.deleteMany() 
    await Organization.deleteMany()
    
    await User.create(jsonUsers)
    await Task.create(jsonTasks)

    const users = await User.find();
    const userObjectIds = users.map(user => user._id);

    const updatedOrganizations = jsonOrganizations.map(org => {
      
      const founder = userObjectIds[Math.floor(Math.random() * userObjectIds.length)];
      const members = userObjectIds.slice(0, Math.floor(Math.random() * userObjectIds.length));
      return { ...org, founder, members };
    
    });

    // Create organizations
    await Organization.create(updatedOrganizations);

    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()