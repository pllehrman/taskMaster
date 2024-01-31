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

OrganizationSchema.statics.getAllOrganizationsWithManagers = async function() {
    return this.aggregate([
        {
            $lookup: {
                from: 'users', // assuming 'users' is the name of your User collection
                localField: 'manager', // field in Organization schema
                foreignField: '_id', // field in User schema
                as: 'managerDetails' // array containing the joined documents
            }
        },
        {
            $unwind: {
                path: '$managerDetails',
                preserveNullAndEmptyArrays: true // keeps organizations without a manager
            }
        }, 
        {
            $project: {
                name: 1, // keeps the organization name
                description: 1, // keeps the organization description
                members: 1, // keeps the organization members
                managerName: '$managerDetails.name', // extracts the manager's name
                founder: 1,
                dateCreated: 1
            }
        }
    ]);
}


module.exports = mongoose.model('Organization', OrganizationSchema)