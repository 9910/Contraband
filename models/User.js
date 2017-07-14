var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, default: 'Forgot Username'},
    password: {type: String, required: true},
    email: {type: String},
    ip: {type: String, default: '127.0.0.1'},
    history: {type: Array, default: []}
});

module.exports = mongoose.model('UserSchema', UserSchema);
