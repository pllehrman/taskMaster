const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')
const session = require('express-session');

// This should get all tasks that apply to the user and have yet to be completed. It also takes a sort parameter.
const getAllTasks = asyncWrapper( async (req,res) => {
    const user_id = req.session.user_id
    let sortOption = req.query.sort || 'time_assigned'; // Default sorting
    let sortOrder = {};
    sortOrder[sortOption] = 1; 

    const tasksData = await Task.findTasksCategorizedByUserRoleWithUserDetails(user_id, false, sortOrder);
    const tasks = {
        asAssigner: tasksData.filter(task => task.assigner._id.equals(user_id)),
        asAssignee: tasksData.filter(task => 
            task.assignees.some(assignee => assignee._id.equals(user_id)) && 
            (!task.ownership || !task.ownership._id) // Ensure no owner is established
        ),
        asOwner: tasksData.filter(task => task.ownership && task.ownership._id.equals(user_id))
    };
    res.status(200).render('task/task_index', {tasks});
} ) 

// Retrieving tasks by organization
const getAllTasksByOrg = asyncWrapper( async (req, res) => {
    const user_id = req.session.user_id
    const organization_id = req.params.id

    const tasks = await Task.findTasksByOrganizationWithUserDetails(user_id, organization_id)
    res.status(200).json({tasks})
})

// Rendering the task form for creation
const renderTaskForm = asyncWrapper( async (req,res) => {
    res.status(200).render('task/task_form');
})

// Get API for getting specific details on tasks
const getTask = asyncWrapper(async (req,res,next) =>{
    const { id:taskID } = req.params
    const task = await Task.findOne({ _id: taskID});
    if (!task) {
        return next(createCustomError(`No Task with id: ${taskID}`, 404))
    }

    res.status(200).json({ task })
})

// Deleting a task.
const deleteTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskID });

    if (!task) {
        req.flash('error', 'Unable to delete task.')
        return res.status(404).json({
            success: false,
            message: 'Task not found. Unable to delete.'
        });
    }

    req.flash('success', "Task deleted successfully.")
    return res.status(200).json({
        success: true,
        message: 'Task deleted successfully.'
    });
});


const markAsDone = asyncWrapper(async (req,res) =>{
    const task_id = req.params.id;
    const user_id = req.session.user_id;
    const task = await Task.markTaskAsDone(task_id, user_id);
    if (!task) {
        req.flash('error', 'Unable to complete task.');
        res.status(200).json({
            success: false,
            message: 'Unable to mark complete.'
        });
    }
    req.flash('success', 'Task(s) marked as done.');
    res.status(200).json({
        success: true,
        message: 'Task marked complete.'
    });


});

const markAsIncomplete = asyncWrapper(async (req,res) => {
    const user_id = req.session.user_id
    const task_id = req.params.id

    const task = await Task.markTaskIncomplete(task_id, user_id);
    if (!task) {
        req.flash('error', 'Unable to mark task.');
        res.status(200).json({
            success: false,
            message: 'Unable to mark task.'
        });
    }
    req.flash('success', 'Task(s) marked as incomplete.');
    res.status(200).json({
        success: true,
        message: 'Task marked incomplete.'
    });

})

const takeResponsibility = asyncWrapper(async (req,res) => {
    const task_id = req.params.id
    const user_id = req.session.user_id
    const task = await Task.takeResponsibility(task_id, user_id)

    if (!task) {
        req.flash('error', 'Unable to take responsibility.');
        res.status(200).json({
            success: false,
            message: 'Unable to take responsibility.'
        });
    }
    req.flash('success', 'You have taken responsibility for task(s).');

    res.status(200).json({
        success: true,
        message: 'User has taken responsibility successfully.'
    });
})

const renderHistory = asyncWrapper(async (req,res) => {
    const user_id = req.session.user_id
    const tasks = await Task.findTasksCategorizedByUserRoleWithUserDetails(user_id, true);

    res.status(200).render('task/task_history', {tasks});
})

const createTask = asyncWrapper(async (req,res) => {
    const user_id = req.session.user_id
    const demo_id = req.session.demo_id;

    const {name, description, organization, users, deadline, completed} = req.body
    
    const completedValue = completed == 'on';

    const task = await Task.create({name: name, description: description, organization: organization, assigner: user_id,
                                    assignees: users, time_deadline: deadline, completed: completedValue, demo_id: demo_id });
                             

    if (!task) {
        req.flash('error', 'Unable to complete task. Please try again.');
        res.status(200).redirect('tasks/new');
    }
    req.flash('success', 'Task has been created and assigned.');
    res.status(200).redirect(`/organizations/${organization}`)

})

module.exports = {
    getAllTasks,
    createTask,
    renderTaskForm,
    getTask,
    getAllTasksByOrg,
    deleteTask,
    markAsDone,
    markAsIncomplete,
    takeResponsibility,
    renderHistory
}