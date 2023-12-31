const express = require('express')
const router = express.Router();

const { 
    getAllOrganizations,
} = require('../controllers/organizations');

const { update } = require('../models/Organization');

router.route('/organization').get(getAllOrganizations)
// router.route('/organization/:id').get(getOrganization).patch(updateTask).delete(deleteTask)


module.exports = router