var models = require("../models");

exports.view = function(req, res) {
    var goodStuff;

	var courseID = "570dc2b7e4b0cbcd095d62e4";
    models.theNews.find({"course_id":courseID}, function(err, stuff){
        if (!err){
             //console.log(courseID);

            goodStuff=stuff;

            //console.log(data);

        } else { console.log(err);}
    });
    models.OverallRating.findOne({'course_id': courseID}, function(err, rating){
        if (err) {return err;}
        var theRating=rating.rating;
        rating.save(function(err, rating) {
        });
        var data = {'newsfeed': goodStuff, 'courseID': courseID, 'rating': theRating};
        res.render('chat', data);
    });


};