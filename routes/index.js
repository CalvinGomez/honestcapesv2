// var models = require("../models");
// var layouts = require('./views/layouts');

exports.view = function(req, res) {
    res.render('index');
}

exports.homepage = function(req, res) {
    res.render('homepage');
}

exports.rating = function(req, res) {
    res.render('results');
}