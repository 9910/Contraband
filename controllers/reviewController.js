var Review = require('../models/review');

module.exports = {
    find: function(params, callback) {
        Review.find(params, function(err, reviews) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, reviews);
        });
    },
    findOne: function(params, callback) {
        Review.findOne(params, function(err, review) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, review);
        });
    },
    findById: function(id, callback) {
        Review.findById(id, function(err, review) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, review);
        });
    },
    update: function(id, params, callback) {
        Review.findByIdAndUpdate(id, params, { new: true }, function(err, review) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, review);
        });
    },
    create: function(review, callback) {
        Review.create(review, function(err, review) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, review)
        });
    },
    delete: function(id, callback) {
        Review.remove(id, function(err) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, true);
        });
    }
};