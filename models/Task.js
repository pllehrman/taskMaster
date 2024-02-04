const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
    name: { 
        type:String, 
        required:[true, 'must provide a name'],
        trim: true, 
        maxlength: [50, 'name can not be more than 50 characters']
    },

    description: {
        type: String,
        trim: true, 
        maxlength: [150, "let's keep it short for now."]
    },

    assigner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' //should be current user's id.
    },

    assignees: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],

    ownership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    time_assigned: {
        type: Date, 
        default: Date.now
    },

    time_deadline: {
        type: Date, 
        default: Date.now
    },

    completed: {
        type:Boolean, 
        default: false
    }, 
    
})

// Static method to get tasks categorized by user role and whether the tasks been completed
TaskSchema.statics.findTasksCategorizedByUserRoleWithUserDetails = function (userId, complete) {

    const currentUserId = mongoose.Types.ObjectId(userId);

    matchCondition = { completed: complete,
                    $or: [
                    { ownership: currentUserId },
                    { assigner: currentUserId },
                    { assignees: currentUserId }
                ]}

    return this.aggregate([
      { $match: matchCondition },
      {
          $lookup: {
              from: 'users', 
              localField: 'assigner',
              foreignField: '_id',
              as: 'assignerDetails'
          }
      },
      {
          $lookup: {
              from: 'users',
              localField: 'assignees',
              foreignField: '_id',
              as: 'assigneeDetails'
          }
      },
      {
          $lookup: {
              from: 'users',
              localField: 'ownership',
              foreignField: '_id',
              as: 'ownerDetails'
          }
      },
      {
        $lookup: {
            from: 'organizations',
            localField: 'organization',
            foreignField: '_id',
            as: 'organizationDetails'
        }
      },
      {
        $unwind: {
            path: '$assignerDetails',
            preserveNullAndEmptyArrays: true
          }
      },
      {
        $unwind: {
            path: '$ownerDetails',
            preserveNullAndEmptyArrays: true
          }
      },
      {
        $unwind: {
            path: '$organizationDetails',
            preserveNullAndEmptyArrays: true
        }
      },
      // Removed $unwind for assigneeDetails
      {
          $project: {
              name: 1,
              description: 1,
              assigner: '$assignerDetails',
              assignees: '$assigneeDetails', // Now keeps all assignee details as an array
              ownership: '$ownerDetails',
              organization: '$organizationDetails',
              time_assigned: 1,
              time_deadline: 1,
              completed: 1
          }
      }
    ])};

// Method to find all tasks associated with the user and specific organization
TaskSchema.statics.findTasksByOrganizationWithUserDetails = function (userId, organizationId) {
    const orgID = mongoose.Types.ObjectId(organizationId);
    const currentUserId = mongoose.Types.ObjectId(userId);
    
    const matchCondition = { organization: orgID,
        $or: [
        { assigner: currentUserId },
        { assignees: currentUserId },
        { ownership: currentUserId }
    ]};
    
    return this.aggregate([
        { $match: matchCondition },
        {
            $lookup: {
                from: 'users', 
                localField: 'assigner',
                foreignField: '_id',
                as: 'assignerDetails'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'assignees',
                foreignField: '_id',
                as: 'assigneeDetails'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'ownership',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
          $unwind: {
              path: '$assignerDetails',
              preserveNullAndEmptyArrays: true
            }
        },
        {
          $unwind: {
              path: '$ownerDetails',
              preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                assigner: '$assignerDetails',
                assignees: '$assigneeDetails', // Now keeps all assignee details as an array
                owner: '$ownerDetails',
                organization: 1,
                time_assigned: 1,
                time_deadline: 1,
                completed: 1
            }
        }]);
};

// Method to mark tasks as complete
TaskSchema.statics.markTaskAsDone = async function(taskId, userId) {
    const currentTaskId = mongoose.Types.ObjectId(taskId);
    const currentUserId = mongoose.Types.ObjectId(userId);
    
    try {
        const task = await this.findOneAndUpdate(
            { 
                _id: currentTaskId, 
                $or: [ 
                    { assigner: currentUserId }, 
                    { ownership: currentUserId } 
                ] 
            },
            { $set: { completed: true } }, // Assuming 'completed' is a field indicating the task's completion status
            { new: true } // Returns the updated document
        );

        if (!task) {
            console.log("No matching task found, or user is not the assigner/owner.");
            return null; // Indicates no task was updated
        } else {
            console.log("Task marked as completed.");
            return task; // Returns the updated task document
        }
    } catch (error) {
        console.error('Error marking task as done:', error);
        throw error;
    }
};

TaskSchema.statics.takeResponsibility = async function(taskId, userId) {
    const currentTaskId = mongoose.Types.ObjectId(taskId);
    const currentUserId = mongoose.Types.ObjectId(userId);
    
    try {
        const task = await this.findOneAndUpdate(
            { 
                _id: currentTaskId, assignees: currentUserId 
                 
            },
            { $set: { ownership: currentUserId } }, // Assuming 'completed' is a field indicating the task's completion status
            { new: true } // Returns the updated document
        );

        if (!task) {
            return null; // Indicates no task was updated
        } else {
            return task; // Returns the updated task document
        }
    } catch (error) {
        console.error('Error marking task as done:', error);
        throw error;
    }

};
      

module.exports = mongoose.model('Task', TaskSchema)