const express = require('express')
const router = express.Router();

const { 
    getAllTasks,
    createTask,
    renderTaskForm,
    getTask,
    getAllTasksByOrg,
    deleteTask,
    markAsDone,
    takeResponsibility,
    renderHistory} = require('../controllers/tasks');

router.route('/').get(getAllTasks);
router.route('/new').get(renderTaskForm).post(createTask);
router.route('/org/:id').get(getAllTasksByOrg);
router.route('/mark/:id').post(markAsDone);
router.route('/history').get(renderHistory);
router.route('/delete/:id').delete(deleteTask);
router.route('/responsibility/:id').post(takeResponsibility);

router.route('/:id').get(getTask).delete(deleteTask);


module.exports = router;