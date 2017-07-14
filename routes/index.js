var express = require('express');
var router = express.Router();
var passport = require('passport');
var fetch = require('node-fetch');

/* GET home page. */
router.get('/', function (req, res, next) {
    fetch('https://yts.ag/api/v2/movie_details.json?movie_id=6538')
        .then(function (res) {
            return res.json();
        }).then(function (johnwick2) {
        fetch('https://yts.ag/api/v2/movie_details.json?movie_id=5588')
            .then(function (res) {
                return res.json();
            }).then(function (johnwick1) {
            fetch('https://yts.ag/api/v2/movie_details.json?movie_id=3960')
                .then(function (res) {
                    return res.json();
                }).then(function (tron) {
                fetch('https://yts.ag/api/v2/movie_details.json?movie_id=2635')
                    .then(function (res) {
                        return res.json();
                    }).then(function (scarface) {
                        var movies = [johnwick2.data.movie, johnwick1.data.movie, tron.data.movie, scarface.data.movie];
                        res.render('index', {bestMovies: movies});
                });
            });
        });
    });
});

router.get('/browse', function (req, res, next) {
    console.log(req.user);
    res.render('browse');
});

router.get('/movie', function (req, res, next) {
    res.render('movie');
});

router.get('/movie/:id', function (req, res) {
    fetch('https://yts.ag/api/v2/movie_details.json?with_cast=true&with_images=true&movie_id=' + req.params.id)
        .then(function (res) {
            return res.json();
        }).then(function (json) {
        console.log('Movie data', json);
        res.render('movie', {movie: json.data.movie}); // 6538 5588
    });
});

router.get('/logout', ensureAuthenticated, function (req, res) {
    console.log('Loged out');
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;
