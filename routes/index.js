var models = require("../models");
// var layouts = require('./views/layouts');

exports.view = function(req, res) {
    res.render('index');
}

exports.homepage = function(req, res) {
    res.render('homepage');
}

exports.courses = function(req, res) {

	models.Course.find({}, function(err, data){
        if (!err){
             // console.log(stuff);

            // var data = {'courseinfo': stuff};
            //console.log(data);
            res.render('courses', {
            	"data" : data
        });
        } else { console.log(err);}
    });
    // res.render('courses');
}

exports.rating = function(req, res) {
    res.render('results');
}