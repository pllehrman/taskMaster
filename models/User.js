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
        type: String
    },
    date_joined: {
        type: Date,
        default: Date.now
    },
    fake: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next) {
    if (this.isNew) {
        this.demo_id = Math.floor(1000 + Math.random() * 9000).toString();
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
