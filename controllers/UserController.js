var bcrypt = require('bcrypt');
var User = require('../models/User');

module.exports = {
   find: function(params, callback){
      User.find(params, function (err, users) {
           if(err){
               callback(err, null);
               return;
           }
           callback(null, users);
       });
   },
   findById: function(id, callback){
      User.findById(id, function (err, user) {
          if(err){
              callback(err, null);
              return;
          }
          callback(null, user);
      });
   },
   update: function(id, params, callback){
      
   },
   create: function(user, callback){
      bcrypt.hash(user.password, 10, function (err, hash) {
         if(err) { throw err; }

         user.password = hash;
         user.save(callback);
      });
   },
   delete: function(id, callback){
      User.remove(id, function (err) {
          if(err){
              callback(err, null);
              return;
          }
          callback(null, true);
      });
   },
    comparePassword: function (user, hash, callback) {
        bcrypt.compare(user.password, hash, function (err, isMatch) {
           if(err){ throw err; }
           callback(null, isMatch);
        });
    }
};
