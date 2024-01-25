const express = require('express')
const router = express.Router();

const { 
    createUser,
    renderSignUp,
    validate,
    renderLogIn,
    exitUser} = require('../controllers/users');

router.route('/signup').get(renderSignUp).post(createUser);
router.route('/login').get(renderLogIn).post(validate);
router.route('/logout').post(exitUser)

module.exports = router;