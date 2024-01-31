const Organization = require('../models/Organization')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')
const session = require('express-session');

const getAllOrganizations = asyncWrapper( async (req,res) => {
    const user_id = req.session.user_id;

    const organizations = await Organization.getAllOrganizationsWithManagers(user_id);
    res.status(200).render('organization/organization_index', { organizations });
}) 

const joinOrganization = asyncWrapper(async (req,res) => {
    const orgID = req.params; // this is the string corresponding to the organization id
    const user_id = req.session.user_id // this is the raw MongoDB ObjectID

    console.log(orgID, user_id);
    // const organization = await Organization.joinOrganization(orgID, user_id)

    res.redirect('/organizations');
})

const renderJoinOrganization = asyncWrapper(async (req,res) => {
    const user_id = req.session.user_id;

    const organizations = await Organization.findOpenOrganizations(user_id);
    
    res.status(200).render('organization/organization_join_index.ejs', {organizations});
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
    const { id:organizationID } = req.params
    const organization = await organization.findOne({ _id: organizationID});
    if (!organization) {
        return next(createCustomError(`No Organizaiton with id: ${organizationID}`, 404))
    }

    res.status(200).json({ organization })
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
    renderJoinOrganization
}