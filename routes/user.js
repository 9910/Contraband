var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// Controller
var User = require('../controllers/index')['user'];

/* GET users listing. */
router.get('/:id', ensureAuthenticated, function (req, res, next) {
    req.user.history.push({
       name: 'John Wick',
        id: '1234112'
    });
    res.render('userProfile', { user: req.user });
});

passport.serializeUser(function (user, done) {
    done(null, user[0].id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//Passport username and password check
passport.use(new localStrategy(
    function (username, password, done) {
        User.find({username: username}, function (err, user) {
            if (err) throw err;
            if (user.length === 0) {
                console.log('Unknown user');
                return done(null, false, {message: 'Unknown user'});
            }

            bcrypt.compare(password, user[0].password, function (err, res) {
                if (err) {
                    throw err;
                }
                if (res) {
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/'
}), function(req, res){
    res.redirect('/user/' + req.user[0].id);
});

router.post('/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var ip = req.connection.remoteAddress;

    User.find({username: username}, function (err, user) {
        if (user.length === 0) {
            console.log(user);
            var newUser = {
                username: username,
                password: password,
                email: email
            };
            User.create(newUser, function (err, user) {
                if (err) {
                    throw err;
                }
                console.log(user);
                res.redirect('/user/' + user.id);
            });
        }
        else {
            console.log(user);
            res.redirect('/');
        }
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;
