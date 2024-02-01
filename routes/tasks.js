const express = require('express')
const router = express.Router();

const { 
    getAllTasks,
    createTask,
    renderTaskForm,
    getTask,
    getAllTasksByOrg,
    deleteTask} = require('../controllers/tasks');

router.route('/').get(getAllTasks);
router.route('/new').get(renderTaskForm).post(createTask);
router.route('/:id').get(getTask).delete(deleteTask);
router.route('/org/:id').get(getAllTasksByOrg);


module.exports = router;