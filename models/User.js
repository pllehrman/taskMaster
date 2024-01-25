const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//This defines the userSchema. Every user must ahve a name, email, phone, 
// and we store their hashed password.

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, "It seems like you've already registered with us."],
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
});

// Method to set the hashed password
userSchema.methods.setPassword = async function(password) {
    const salt = await bcrypt.genSalt();
    this.passwordHash = await bcrypt.hash(password, salt);
};

// Method to validate the password
userSchema.methods.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
};
 
const User = mongoose.model('User', userSchema);

module.exports = User;
