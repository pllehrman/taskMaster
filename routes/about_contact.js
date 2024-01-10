const express = require('express')
const router = express.Router();


router.get('/about', (req, res) => { 
    res.render('about_contact/about');
});

router.get('/contact', (req, res) => {
    res.render('about_contact/contact_form');
});



module.exports = router;