const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');

// user signing up
const createUser = asyncWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email });
    await user.setPassword(password);
    await user.save();

    // Establishing the session variables
    req.session.userId = user._id;
    req.session.name = user.name;
    req.session.username = user.email;

    res.redirect('/organizations');
});

const renderSignUp = asyncWrapper(async (req, res, next) => {
    res.status(200).render('signup');
});

// user logging in
const validate = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createCustomError("Email or password not provided", 400));
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
        return next(createCustomError("Invalid email or password", 401));
    }

    // Establishing the session variables
    req.session.userId = user._id;
    req.session.name = user.name;
    req.session.username = user.email;

    res.redirect('/organizations');
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
