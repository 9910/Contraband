var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/browse', function(req, res, next) {
    res.render('browse');
});

router.get('/movie', function (req, res, next) {
    res.render('movie');
});

// router.get('/login', function(req, res, next) {
//     res.render('login');
// });
//
// router.get('/profile', function(req, res, next) {
//     res.render('profile');
// });

module.exports = router;
