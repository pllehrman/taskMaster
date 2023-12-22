const express = require('express')
const router = express.Router();

const { 
    getAllTasks,
    createTask,
    renderTaskForm,
    getTask,
    updateTask,
    deleteTask} = require('../controllers/tasks');
const { update } = require('../models/Task');

router.route('/task').get(getAllTasks).post(createTask)
router.route('/task/new').get(renderTaskForm)
router.route('/task/:id').get(getTask).patch(updateTask).delete(deleteTask)


module.exports = router