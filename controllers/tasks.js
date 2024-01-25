const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')

const getAllTasks = asyncWrapper( async (req,res) => {
    const tasks = await Task.find({})
    res.status(200).render('task/task_index', {tasks});
} ) 

const createTask = asyncWrapper( async (req,res) =>{
    const { name, description} = req.body;
    const task = await Task.create( {name, description, completed: false})

    res.redirect('/task');
})

const renderTaskForm = asyncWrapper( async (req,res) => {
    res.status(200).render('task/task_form');
})

const getTask = asyncWrapper(async (req,res,next) =>{
    const { id:taskID } = req.params
    const task = await Task.findOne({ _id: taskID});
    if (!task) {
        return next(createCustomError(`No Task with id: ${taskID}`, 404))
    }

    res.status(200).json({ task })
})

const updateTask = asyncWrapper(async (req,res) =>{
    const {id:taskID} = req.params
    const task = await Task.findOneAndUpdate({_id: taskID}, req.body, {
        new:true,
        runValidators:true
    })
    if(!task) {
        return next(createCustomError(`No Task with id: ${taskID}`, 404))
    }

    res.status(200).json({ task })
})

const deleteTask = asyncWrapper(async (req,res) =>{
    const {id:taskID} = req.params
    const task = await Task.findOneAndDelete({_id:taskID})
    
    if(!task){
        return next(createCustomError(`No Task with id: ${taskID}`, 404))
    }
    // res.status(200).json({ task })
    res.status(200).json({ task: null, status: 'success'})
})

module.exports = {
    getAllTasks,
    createTask,
    renderTaskForm,
    getTask,
    updateTask,
    deleteTask
}