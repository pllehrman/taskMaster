const express = require('express')
const router = express.Router();

const { 
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask} = require('../controllers/tasks');
const { update } = require('../models/Task');

router.route('/tasks').get(getAllTasks).post(createTask)
router.route('/task/:id').get(getTask).patch(updateTask).delete(deleteTask)


module.exports = router