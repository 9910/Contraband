var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, default: 'Forgot Username'},
    password: {type: String, required: true},
    email: {type: String}
});

module.exports = mongoose.model('UserSchema', UserSchema);
