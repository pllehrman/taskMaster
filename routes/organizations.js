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
} = require('../controllers/organizations');


router.route('/').get(getAllOrganizations);
router.route('/join').get(renderJoinSelect);
router.route('/join/:id').post(joinOrganization);
router.route('/new').get(renderOrganizationForm).post(createOrganization);
router.route('/:id').get(getOrganization);
router.route('/join/select').get(renderJoinOrganization); //renders all the open organizations for joining

// router.route('/organization/:id').get(getOrganization).patch(updateTask).delete(deleteTask)


module.exports = router