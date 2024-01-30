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
    demo_id: {
        type: String,
        required: [true, 'Session needs an id.']
    },
    date_joined: {
        type: Date,
        default: Date.now
    }
});

// Method to generate sessionID
userSchema.statics.generateDemoID = async function() {
    return Math.floor(1000 + Math.random() * 9000)
}

const User = mongoose.model('User', userSchema);

module.exports = User;
