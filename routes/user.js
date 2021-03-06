var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook');
var TwitterStrategy = require('passport-twitter');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var bcrypt = require('bcrypt-nodejs');

var picName;
//Handle File Uploads
var s3 = new aws.S3({
    "accessKeyId": process.env.ACCESS_KEY_ID,
    "secretAccessKey": process.env.ACCESS_SECRET_ID,
    "region": process.env.REGION
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'contraband123',
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            console.log(file);
            picName = Date.now().toString();
            cb(null, Date.now().toString()); //use Date.now() for unique file keys
        }
    })
});

// Controllers
var User = require('../controllers/index')['user'];
var Review = require('../controllers/index')['review'];

/* GET users listing. */
router.get('/admin', ensureAuthenticatedAdminStyle, function(req, res) {
    User.find({}, function(err, users) {
        res.render('admin', { layout: false, users: users });
    });
});

router.get('/adminLogin', function(req, res, next) {
    res.render('adminLogin', { layout: false });
});

router.get('/downloads/:id', ensureAuthenticatedAdminStyle, function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        res.render('userDownloads', { layout: false, user: user });
    });
});

router.get('/deleteUser/:id', ensureAuthenticatedAdminStyle, function(req, res, next) {
    User.delete(req.params.id, function(err, user) {
        res.redirect('/user/admin');
    });
});

router.get('/:id', ensureAuthenticated, function(req, res, next) {
    res.render('userProfile', { user: req.user });
});

router.post('/addReview', ensureAuthenticated, function(req, res, next) {
    console.log('MovieID:', req.body);
    Review.create({
        movieId: req.body.movieId,
        username: req.user.username,
        data: req.body.data
    }, function(err, review) {
        if (err) throw err;
        console.log('Review added:', review);
        res.redirect('/movie/' + req.body.movieId);
    });
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/changePic', ensureAuthenticated, upload.single('file'), function(req, res) {
    User.update(req.user.id, { picture: picName }, function(err, user) {
        if (err) throw err;
        console.log('User updated: ', user);
        res.redirect('/user/' + user.id);
    });
});

//Passport username and password check
passport.use(new localStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) throw err;
            if (!user) {
                console.log('Unknown user');
                return done(null, false, { message: 'Unknown user' });
            }

            bcrypt.compare(password, user.password, function(err, res) {
                if (err) {
                    throw err;
                }
                if (res) {
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, { message: 'Invalid Password' });
                }
            });
        });
    }
));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/'
}), function(req, res) {
    if (req.user.admin)
        res.redirect('/user/admin');
    else
        res.redirect('/user/' + req.user.id);
});

router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var ip = req.connection.remoteAddress;

    User.find({ username: username }, function(err, user) {
        if (user.length === 0) {
            console.log(user);
            var newUser = {
                username: username,
                password: password,
                email: email
            };
            User.create(newUser, function(err, user) {
                if (err) {
                    throw err;
                }
                console.log(user);
                res.redirect('/user/' + user.id);
            });
        } else {
            console.log(user);
            res.redirect('/');
        }
    });
});

// Facebook Auth
passport.use(new FacebookStrategy({
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL: "http://localhost:3000/user/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        process.nextTick(function() {
            User.findOne({ 'facebookId': profile.id }, function(err, user) {
                if (err) return cb(err);
                if (user) {
                    console.log('===========================================================');
                    console.log('Facebook user:', user);
                    console.log('===========================================================');
                    return cb(null, user);
                } else {
                    console.log('object:', profile);
                    var profileName = profile.displayName;
                    var email = 'someEmail@gmail.com';

                    User.create({
                        'facebookId': profile.id,
                        'username': profile.displayName,
                        'email': email
                    }, function(err, user) {
                        if (err) throw err;
                        console.log('===========================================================');
                        console.log('New Facebook user:', user);
                        console.log('===========================================================');
                        return cb(null, user);
                    });
                }
            });
        });
    }
));

router.get('/login/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/user/' + req.user.id);
    });

// Twitter Auth
passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CUSTOMER_KEY,
        consumerSecret: process.env.TWITTER_KEY,
        callbackURL: "http://localhost:3000/user/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
        process.nextTick(function() {
            User.findOne({ 'twitterId': profile.id }, function(err, user) {
                if (err) return cb(err);
                if (user) {
                    console.log('===========================================================');
                    console.log('Twitter user:', user);
                    console.log('===========================================================');
                    return cb(null, user);
                } else {
                    console.log('object:', profile);
                    var profileName = profile.displayName;
                    var email = "someEmail@gmail.com";

                    User.create({
                        'twitterId': profile.id,
                        'username': profile.displayName,
                        'email': email
                    }, function(err, user) {
                        if (err) throw err;
                        console.log('===========================================================');
                        console.log('New Twitter user:', user);
                        console.log('===========================================================');
                        return cb(null, user);
                    });
                }
            });
        });
    }
));

router.get('/login/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/user/' + req.user.id);
    });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

function ensureAuthenticatedAdminStyle(req, res, next) {
    console.log('If it is', req.user.admin);
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;