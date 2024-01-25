const express = require('express')
const router = express.Router();

const { 
    getAllOrganizations,
    renderOrganizationForm,
    createOrganization
} = require('../controllers/organizations');


router.route('/').get(getAllOrganizations).post(createOrganization);
router.route('/new').get(renderOrganizationForm);
// router.route('/organization/:id').get(getOrganization).patch(updateTask).delete(deleteTask)


module.exports = router