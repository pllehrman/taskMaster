const express = require('express')
const router = express.Router();

const { 
    getAllOrganizations,
    renderOrganizationForm,
    createOrganization,
    joinOrganization,
    renderJoinSelect,
    getOrganization,
    renderJoinOrganization,
    renderJoinSpecificOrganization
} = require('../controllers/organizations');


router.route('/').get(getAllOrganizations); // dashboard route to retrieve all organizations.
router.route('/new').get(renderOrganizationForm).post(createOrganization); // renders form for creating organizations. Post method for org creation.
router.route('/join').get(renderJoinSelect); // renders choice for choosing already existing vs. new org.
router.route('/join/:id').post(joinOrganization); // post route for join an already existing org.
router.route('/join/select').get(renderJoinOrganization); //renders all the open organizations for joining.
router.route('/join/select/:id').get(renderJoinSpecificOrganization);  //renders specific organization user might join.

router.route('/:id').get(getOrganization); // renders a single organization.



module.exports = router