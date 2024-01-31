const express = require('express')
const router = express.Router();

const { 
    getAllOrganizations,
    renderOrganizationForm,
    createOrganization,
    joinOrganization,
    renderJoinOrganization,
} = require('../controllers/organizations');


router.route('/').get(getAllOrganizations).post(createOrganization);
router.route('/new').get(renderOrganizationForm); 
router.route('/join').get(renderJoinOrganization);
router.route('/join/:id').post(joinOrganization);
// router.route('/organization/:id').get(getOrganization).patch(updateTask).delete(deleteTask)


module.exports = router