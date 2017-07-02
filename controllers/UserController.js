var bcrypt = require('bcrypt-nodejs');
var User = require('../models/User');

module.exports = {
    find: function (params, callback) {
        User.find(params, function (err, users) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, users);
        });
    },
    findById: function (id, callback) {
        User.findById(id, function (err, user) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, user);
        });
    },
    update: function (id, params, callback) {
        User.findByIdAndUpdate(id, params, {new: true}, function (err, user) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, user);
        });
    },
    create: function (user, callback) {
        bcrypt.hash(user.password, null, null, function (err, hash) {
            if (err) {
                callback(err, null);
                return;
            }
            user.password = hash;
            User.create(user, function (err, user) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, user)
            });
        });
    },
    delete: function (id, callback) {
        User.remove(id, function (err) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, true);
        });
    },
    comparePassword: function (password, hash, callback) {
        bcrypt.compare(password, hash, function (err, res) {
            console.log(res);
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, res);
        });
    }
};
