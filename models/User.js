var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    admin: Boolean,
    facebookId: { type: String },
    twitterId: { type: String },
    username: { type: String, default: 'Forgot Username' },
    password: { type: String, required: true },
    email: { type: String },
    history: []
});

module.exports = mongoose.model('UserSchema', UserSchema);