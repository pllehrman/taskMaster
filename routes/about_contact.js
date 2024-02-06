const Organization = require('../models/Organization')

const express = require('express')
const router = express.Router();


router.get('/', async (req, res) => { 
    try {
        const organizations = await Organization.find({fake: true})
        console.log(organizations);
        res.render('about', {organizations});
    } catch (error) {
        console.error('Failed to fetch organizations.', error)
    }
    
});

router.get('/contact', (req, res) => {
    res.render('contact_form');
});



module.exports = router;