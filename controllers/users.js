const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const session = require('express-session');

// user signing up
const createUser = asyncWrapper(async (req, res, next) => {
    const { name } = req.body;

    const user = new User({ name }); // creating the new user. Demo_id generated automatically
    await user.save() //saves the user to the datatbase.

    // Establishing the session variables
    req.session.name = user.name;
    req.session.demo_id = user.demo_id;
    req.session.user_id = user._id

    res.render('user/thankyou', { name: user.name, demo_id: user.demo_id });

});

const renderSignUp = asyncWrapper(async (req, res, next) => {
    res.status(200).render('signup');
});

// user logging in
const validate = asyncWrapper(async (req, res, next) => {
    const demo_id = 1825;
    // const demo_id = String(req.body.id);
    if (!demo_id ) {
        req.flash('error', 'Please provide a Demo ID.')
        return res.redirect('/login');
    }
    
    const user = await User.findOne({ demo_id });
    
    if (!user) {
        req.flash('error', "We're sorry. We don't have a record of this demo ID. Please start a new demo session.")
        return res.redirect('/signup');
    }

    // Establishing the session variables
    req.session.name = user.name;
    req.session.demo_id = demo_id;
    req.session.user_id = user._id;

    res.render('user/welcome_back', { name: user.name, demo_id: demo_id });
});

const renderLogIn = asyncWrapper(async (req, res, next) => {
    res.status(200).render('login');
});

// logout
const exitUser = asyncWrapper(async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(createCustomError('Error in logging out', 500));
        }
        res.redirect('/');
    });
});

module.exports = {
    createUser,
    renderSignUp,
    validate,
    renderLogIn,
    exitUser
};
