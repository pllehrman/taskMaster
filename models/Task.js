const mongoose = require('mongoose');

// Schema for a single Task. Other attributes that are passed as a task object 
// will not be included.

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
    
    completed: {
        type:Boolean, 
        default: false
    }, 
    
})



module.exports = mongoose.model('Task', TaskSchema)