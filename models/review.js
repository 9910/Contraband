var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
    movieId: String,
    username: String,
    data: String
});

module.exports = mongoose.model('review', ReviewSchema);