const mongoose = require('mongoose');


// SCHEMA FOR AN ORGANIZATION: name, description, 
// array of members, founding member, date_created


const OrganizationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'must provide a name'],
        trim: true, 
        maxlength: [100, 'name can not be more than 20 characters']
    },
    
    description: {
        type:String, 
        required: [true, 'must provide some kind of description'],
        trim: true,
        maxlength: [500, 'description must be snappy and short.']

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

    private: {
        type: Boolean,
        default: false
    },

    dateCreated: {
        type: Date,
        default: Date.now
    },
    logoUrl: {
        type:String,
        default: '/images/standard.png'
    },
    fake: {
        type:Boolean,
        default: true
    }

});

// This returns all organizations either related to the user or not based on isMember argument.
OrganizationSchema.statics.getAllOrganizationsWithDetails = async function(currentUserId, isMember) {
    const userId = mongoose.Types.ObjectId(currentUserId);

    let matchCondition = {};
    if (isMember) {
        // User is a member of the organization
        matchCondition = { members: userId };
    } else {
        // User is not a member of the organization
        matchCondition = { members: { $ne: userId }, private: false};
    }

    return this.aggregate([
        {
            $match: matchCondition
        },
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
                dateCreated: 1,
                logoUrl: 1
            }
        }
    ]);
};

// This returns a specfic organization with advanced details on manager and founder.
OrganizationSchema.statics.getOrganizationWithDetails = async function(organizationID) {
    const orgID = mongoose.Types.ObjectId(organizationID);

    return this.aggregate([
        {
            $match: {
                _id: orgID // filters to include only the targeted organization
            }
        },
        {
            $lookup: {
                from: 'users', // Assuming 'users' is the name of your User collection
                localField: 'manager', // Field in Organization schema
                foreignField: '_id', // Field in User schema
                as: 'managerDetails' // Array containing the joined documents
            }
        },
        {
            $unwind: {
                path: '$managerDetails',
                preserveNullAndEmptyArrays: true // Keeps organizations without a manager
            }
        },
        {
            $lookup: {
                from: 'users', // For the founder
                localField: 'founder', // Adjusted for the founder
                foreignField: '_id',
                as: 'founderDetails' // Array for founder details
            }
        },
        {
            $unwind: {
                path: '$founderDetails',
                preserveNullAndEmptyArrays: true // Keeps organizations without a founder
            }
        },
        {
            $project: {
                name: 1, // Keeps the organization name
                description: 1, // Keeps the organization description
                members: 1, // Keeps the organization members
                managerName: '$managerDetails.name', // Extracts the manager's name
                founderName: '$founderDetails.name', // Extracts the founder's name
                private: 1, // Keeps the privacy status
                dateCreated: 1,
                logoUrl: 1 
            }
        }
    ]);    
};

// This returns an organization with the names of all the members in an array.
OrganizationSchema.statics.getOrganizationMembership = async function(organizationID) {
    const orgID = mongoose.Types.ObjectId(organizationID);

    return this.aggregate([
        {
            $match: {
                _id: orgID // filters to include only the targeted organization
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'memberDetails'
            }
        },
        {
            $unwind: {
                path: '$memberDetails',
                preserveNullAndEmptyArrays: true // Keeps organizations without a founder
            }
        },
        {
            $project: {
                member: '$memberDetails', // Keeps the organization members
            }
        }
    ]);   
};

// This checks to see if there already exists an organization with the name in the DB.
OrganizationSchema.statics.checkDuplicate = async function(name) {
    const count = await this.countDocuments({name});
    return count > 0;
};

OrganizationSchema.statics.joinOrganization = async function(organizationId, memberObjectId) {
    try {
        const result = await this.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(organizationId) },
            { $addToSet: { members: mongoose.Types.ObjectId(memberObjectId) } }
        );

        if (result.modifiedCount === 0) {
            console.log("Member was already in the organization or organization not found.");
        } else {
            console.log("Member was successfully added to the organization.");
        }
        return result;
    } catch (error) {
        console.error('Error adding member to the organization:', error);
        throw error;
    }
};

OrganizationSchema.statics.getAllOrganizationDetails = async function(organizationID) {
    const orgID = mongoose.Types.ObjectId(organizationID);

    return this.aggregate([
        {
            $match: {
                _id: orgID // filters to include only the targeted organization
            }
        },
        {
            $lookup: {
                from: 'users', // Assuming 'users' is the name of your User collection
                localField: 'manager', // Field in Organization schema
                foreignField: '_id', // Field in User schema
                as: 'managerDetails' // Array containing the joined documents
            }
        },
        {
            $unwind: {
                path: '$managerDetails',
                preserveNullAndEmptyArrays: true // Keeps organizations without a manager
            }
        },
        {
            $lookup: {
                from: 'users', // For the founder
                localField: 'founder', // Adjusted for the founder
                foreignField: '_id',
                as: 'founderDetails' // Array for founder details
            }
        },
        {
            $unwind: {
                path: '$founderDetails',
                preserveNullAndEmptyArrays: true // Keeps organizations without a founder
            }
        },
        {
            $lookup: {
                from: 'users', // For the founder
                localField: 'members', // Adjusted for the founder
                foreignField: '_id',
                as: 'memberDetails' // Array for founder details
            }
        },
        {
            $project: {
                name: 1, // Keeps the organization name
                description: 1, // Keeps the organization description
                managerDetails: 1, // Extracts the manager's details
                founderDetails: 1, // Extracts the founder's details
                memberDetails: 1, // Extracts the member details
                private: 1, // Keeps the privacy status
                dateCreated: 1,
                logoUrl: 1 // Keeps the date the organization was created
            }
        }
    ]);  
    
}





module.exports = mongoose.model('Organization', OrganizationSchema)