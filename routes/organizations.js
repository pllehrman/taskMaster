const express = require('express')
const router = express.Router();

const { 
    getAllOrganizations,
    renderOrganizationForm,
    createOrganization
} = require('../controllers/organizations');

const { update } = require('../models/Organization');

router.route('/organization').get(getAllOrganizations).post(createOrganization)
router.route('/organization/new').get(renderOrganizationForm)
// router.route('/organization/:id').get(getOrganization).patch(updateTask).delete(deleteTask)


module.exports = router