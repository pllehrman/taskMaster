const mongoose = require('mongoose');

// SCHEMA FOR AN ORGANIZATION: name, description, 
// array of members, founding member, date_created


const OrganizationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'must provide a name'],
        trim: true, 
        maxlength: [20, 'name can not be more than 20 characters']
    },
    
    description: {
        type:String, 
        required: [true, 'must provide some kind of description'],
        trim: true,
        maxlength: [200, 'description must be snappy and short.']

    },
    
    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }], 

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //should default to the current user's id.
    },

    founder: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false
        //should default to the current user's id.
    },

    dateCreated: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Organization', OrganizationSchema)