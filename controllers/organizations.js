const Organization = require('../models/Organization')
const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')
const session = require('express-session');
const { USE_PROXY } = require('http-status-codes');

const getAllOrganizations = asyncWrapper( async (req,res) => {
    const user_id = req.session.user_id;

    const organizations = await Organization.getAllOrganizationsWithDetails(user_id, true);
    res.status(200).render('organization/organization_index', { organizations });
}) 

const joinOrganization = asyncWrapper(async (req,res) => {
    const orgID = req.params; // this is the string corresponding to the organization id
    const user_id = req.session.user_id // this is the raw MongoDB ObjectID

    console.log(orgID, user_id);
    // const organization = await Organization.joinOrganization(orgID, user_id)

    res.redirect('/organizations');
})

const renderJoinSelect = asyncWrapper(async (req, res) => {
    res.status(200).render('organization/organization_join')
})

const renderJoinOrganization = asyncWrapper(async (req,res) => {
    const user_id = req.session.user_id;

    const organizations = await Organization.getAllOrganizationsWithDetails(user_id, false);
    
    res.status(200).render('organization/organization_join_index', {organizations});
})

const createOrganization = asyncWrapper( async (req,res) =>{
    const { name, description} = req.body
    const founder = 'current_user.id'
    const date_created = Date.now();
    const organization = await Organization.create({name, description, date_created})

    res.redirect('/organizations');
})

const renderOrganizationForm = asyncWrapper( async (req,res) => {
    res.status(200).render('organization/organization_form');
})

const getOrganization = asyncWrapper(async (req,res,next) =>{
    const organizationID = req.params.id
    const organizations = await Organization.getOrganizationWithDetails(organizationID);
    const organization = organizations[0]

    const user_id = req.session.user_id
    const tasksData = await Task.findTasksByOrganizationWithUserDetails(user_id, organizationID);
    const tasks = {
        asAssigner: tasksData.filter(task => task.assigner._id.equals(user_id)),
        asAssignee: tasksData.filter(task => task.assignees.some(assignee => assignee._id.equals(user_id))),
        asOwner: tasksData.filter(task => task.ownership && task.ownership._id.equals(user_id))
    };
    
    if (!organization) {
        return next(createCustomError(`No Organizaiton with id: ${organizationID}`, 404))
    }

    res.status(200).render('organization/organization_view',{organization, tasks})
})

const updateOrganization = asyncWrapper(async (req,res) =>{
    const {id:organizationID} = req.params
    const organization = await Organization.findOneAndUpdate({_id: organizationID}, req.body, {
        new:true,
        runValidators:true
    })
    if(!organization) {
        return next(createCustomError(`No organization with id: ${organizationID}`, 404))
    }

    res.status(200).json({ organization })
})

const deleteOrganization = asyncWrapper(async (req,res) =>{
    const {id:organizationID} = req.params
    const organization = await organization.findOneAndDelete({_id:organizationID})
    
    if(!organization){
        return next(createCustomError(`No organization with id: ${organizationID}`, 404))
    }
    // res.status(200).json({ organization })
    res.status(200).json({ organization: null, status: 'success'})
})

module.exports =  {
    getAllOrganizations,
    renderOrganizationForm,
    createOrganization,
    joinOrganization,
    renderJoinSelect,
    renderJoinOrganization,
    getOrganization
}