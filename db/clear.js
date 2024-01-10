require('dotenv').config();

const connectDB = require('./connect')

const Task = require('../models/Task')
const Organization = require('../models/Organization')
const User = require('../models/User');


const clear = async () => {
  try {
    await connectDB(process.env.MONGO_URI) //await connection to the db

    //Clearing house (db); note order is important due to references.
    await User.deleteMany()
    await Task.deleteMany() 
    await Organization.deleteMany()

    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

clear()