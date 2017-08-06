var express = require('express');
var router = express.Router();
var passport = require('passport');
var fetch = require('node-fetch');
var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_SECRET
});

console.log('ENV', process.env.PAYPAL_CLIENT_ID);

var User = require('../controllers/index')['user'];

/* GET home page. */
router.get('/', function(req, res, next) {
    fetch('https://yts.ag/api/v2/movie_details.json?movie_id=6538')
        .then(function(res) {
            return res.json();
        }).then(function(johnwick2) {
            fetch('https://yts.ag/api/v2/movie_details.json?movie_id=5588')
                .then(function(res) {
                    return res.json();
                }).then(function(johnwick1) {
                    fetch('https://yts.ag/api/v2/movie_details.json?movie_id=3960')
                        .then(function(res) {
                            return res.json();
                        }).then(function(tron) {
                            fetch('https://yts.ag/api/v2/movie_details.json?movie_id=2635')
                                .then(function(res) {
                                    return res.json();
                                }).then(function(scarface) {
                                    var movies = [johnwick2.data.movie, johnwick1.data.movie, tron.data.movie, scarface.data.movie];
                                    res.render('index', {
                                        bestMovies: movies
                                    });
                                });
                        });
                });
        });
});

router.get('/browse', function(req, res, next) {
    console.log(req.user);
    res.render('browse');
});

router.get('/movie', function(req, res, next) {
    res.render('movie');
});

// Display Movies
router.get('/movie/:id', function(req, res) {
    fetch('https://yts.ag/api/v2/movie_details.json?with_cast=true&with_images=true&movie_id=' + req.params.id)
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            console.log('Movie data', json);
            res.render('movie', {
                movie: json.data.movie
            }); // 6538 5588
        });
});

// Handle Movie Downloads
router.get('/user/download/:quality/:id', ensureAuthenticated, function(req, res) {
    fetch('https://yts.ag/api/v2/movie_details.json?&movie_id=' + req.params.id)
        .then(response => response.json())
        .then(json => {
            User.update(req.user.id, { history: json.data.movie }, function(err, user) {
                if (req.params.quality === "720p") {
                    json.data.movie.torrents.forEach(function(torrent) {
                        if (torrent.quality === "720p") {
                            res.redirect(torrent.url);
                        }
                    });
                } else if (req.params.quality === "3D") {
                    json.data.movie.torrents.forEach(function(torrent) {
                        if (torrent.quality === "3D") {
                            res.redirect(torrent.url);
                        }
                    });
                } else if (req.params.quality === "1080p") {
                    var create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "/user/" + req.user.id,
                            "cancel_url": "/"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "item",
                                    "sku": "item",
                                    "price": "5.00",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "5.00"
                            },
                            "description": "This is the payment description."
                        }]
                    };

                    paypal.payment.create(create_payment_json, function(error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            console.log("Create Payment Response");
                            console.log(payment);
                            json.data.movie.torrents.forEach(function(torrent) {
                                if (torrent.quality === "1080p") {
                                    res.redirect(torrent.url);
                                }
                            });
                        }
                    });
                }
            });
        });
});

router.get('/logout', ensureAuthenticated, function(req, res) {
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