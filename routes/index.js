var express = require('express');
var router = express.Router();
var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/browse', function(req, res, next) {
    console.log(req.user);
    res.render('browse');
});

router.get('/movie', function (req, res, next) {
    res.render('movie');
});

router.get('/logout', ensureAuthenticated, function(req, res) {
    console.log('Loged out');
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;
