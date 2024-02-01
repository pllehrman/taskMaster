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
        ref: 'User',
        default: null
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
        default: Date.now
    },

    completed: {
        type:Boolean, 
        default: false
    }, 
    
})

// Static method to get tasks categorized by user role
TaskSchema.statics.findTasksCategorizedByUserRoleWithUserDetails = function (currentUserId) {

    currentUserId = mongoose.Types.ObjectId(currentUserId);

    matchCondition = {
                    $or: [
                    { assigner: currentUserId },
                    { assignees: currentUserId },
                    { ownership: currentUserId }
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
      // Removed $unwind for assigneeDetails
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
      }
    ])};
            
TaskSchema.statics.findTasksByOrganizationWithUserDetails = function (currentUserId, organizationId) {
  organizationId = mongoose.Types.ObjectId(organizationId);
  currentUserId = mongoose.Types.ObjectId(currentUserId);

  const matchCondition = { 
      organization: organizationId, 
      $or: [
      { assigner: currentUserId },
      { assignees: currentUserId },
      { ownership: currentUserId }
  ] };
  
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
            assignees: '$assigneeDetails', // Now keeps all assignee details
            owner: '$ownerDetails',
            organization: 1,
            time_assigned: 1,
            time_deadline: 1,
            completed: 1
        }
    }
])};
  
      

module.exports = mongoose.model('Task', TaskSchema)