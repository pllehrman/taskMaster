const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
    name: { 
        type:String, 
        required:[true, 'must provide a name'],
        trim: true, 
        maxlength: [20, 'name can not be more than 20 characters']
    },

    description: {
        type: String,
        trim: true, 
        maxlength: [100, "let's keep it short for now."]
    },

    assigner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' //should be current user's id.
    },

    assignees: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],

    owernship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    time_assinged: {
        type: Date, 
        default: Date.now
    },

    time_deadline: {
        type: Date, 
    }, 

    completed: {
        type:Boolean, 
        default: false
    }, 
    
})



module.exports = mongoose.model('Task', TaskSchema)