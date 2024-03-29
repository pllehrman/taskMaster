const Organization = require('../models/Organization')
const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')
const session = require('express-session');
const { USE_PROXY } = require('http-status-codes');

const getAllOrganizations = asyncWrapper( async (req,res) => {
    const user_id = req.session.user_id;
    const demo_id = req.session.demo_id

    const organizations = await Organization.getAllOrganizationsWithDetails(user_id, true, demo_id);
    console.log(organizations);
    
    res.status(200).render('organization/organization_index', { organizations });
}) 

const joinOrganization = asyncWrapper(async (req,res) => {
    const orgID = req.params.id; // this is the string corresponding to the organization id
    const user_id = req.session.user_id // this is the raw MongoDB ObjectID

    const organization = await Organization.joinOrganization(orgID, user_id)
   
    if (!organization) {
        req.flash('error', 'Unable to join that organization.');
        res.status(200).json({
            success: false,
            message: 'Unable to join an organization.',
            redirectTo: '/organizations' // Specify where to redirect if needed
        });
        
    }
    req.flash('success', `You successfully joined the ${organization.name} organization.`);
    res.status(200).json({
        success: true,
        message: 'Successfully joined the organization.',
        redirectTo: '/organizations' // Specify where to redirect if needed
    });

    

})

const renderJoinSelect = asyncWrapper(async (req, res) => {
    res.status(200).render('organization/organization_join')
})

// When the user wants to browse the open organizations that they can join.
const renderJoinOrganization = asyncWrapper(async (req,res) => {
    const user_id = req.session.user_id;
    const demo_id = req.session.demo_id

    const organizations = await Organization.getAllOrganizationsWithDetails(user_id, false, demo_id);
    
    res.status(200).render('organization/organization_join_index', {organizations});
})

// When the user wants to "learn more" about an organization on the join organizations page.
const renderJoinSpecificOrganization = asyncWrapper(async (req,res) => {
    const org_id = req.params.id

    const organizations = await Organization.getAllOrganizationDetails(org_id);
    const organization = organizations[0];
    console.log(organization);

    res.status(200).render('organization/organization_join_view', {organization})

})

// When the user wants to create their own organization.
const createOrganization = asyncWrapper( async (req,res) =>{
    const { name, description, private} = req.body
    const founder = req.session.user_id
    const manager = req.session.user_id
    const members = [req.session.user_id] 
    const fake = false
    const demo_id = req.session.demo_id

    const organization_check = await Organization.checkDuplicate(name)

    if (organization_check) {
        req.flash('error', 'Organization with this name alrady exists. Please try again with a new name.')
        return res.redirect('/organizations/new');
    }
    
    await Organization.create({name, description, members, founder, manager, private, fake, demo_id})
    req.flash('success', 'Organization created successfully.');

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
    const tasksData = await Task.findTasksByOrganization(user_id, organizationID);
    const tasks = {
        asAssigner: tasksData.filter(task => task.assigner._id.equals(user_id)),
        asAssignee: tasksData.filter(task => 
            task.assignees.some(assignee => assignee._id.equals(user_id)) && 
            (!task.ownership || !task.ownership._id) // Ensure no owner is established
        ),
        asOwner: tasksData.filter(task => task.ownership && task.ownership._id.equals(user_id))
    };
    
    if (!organization) {
        console.log('Error: get request for this organization not found.')
        res.status(404).render('not_found');
    }

    res.status(200).render('organization/organization_view',{organization, tasks})
})

const organizationsAPI = asyncWrapper(async (req,res) => {
    const user_id = req.session.user_id;
    const demo_id = req.session.demo_id

    const organizations = await Organization.getAllOrganizationsWithDetails(user_id, true, demo_id);
    if (!organizations) {
        res.status(200).json({
            success: false,
            message: 'Unable to retrieve organizations',
        })
    }
    res.status(200).json({
        success: true,
        message: 'Organizations retrieved.',
        organizations: organizations
    });

});

const organizationUsersAPI = asyncWrapper(async (req,res) => {
    organizationID = req.params.id;
    const demo_id = req.session.demo_id

    const organization = await Organization.getOrganizationMembership(organizationID, demo_id);
    console.log(organization);
    if (!organization) {
        res.status(200).json({
            success: false,
            message: 'Unable to retrieve organizations',
        })
    }
    res.status(200).json({
        success: true,
        message: 'Organization members retrieved.',
        organization: organization
    });
});


module.exports =  {
    getAllOrganizations,
    renderOrganizationForm,
    createOrganization,
    joinOrganization,
    renderJoinSelect,
    renderJoinOrganization,
    getOrganization,
    renderJoinSpecificOrganization,
    organizationUsersAPI,
    organizationsAPI
}