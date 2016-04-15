var models = require("../models");

exports.view = function(req, res) {

	var courseID = "570dc2b7e4b0cbcd095d62e4";
    console.log(req.body.courseid);
    models.theNews.find({"course_id":req.body.courseid}, function(err, stuff){
        if (!err){
             //console.log(courseID);
            models.OverallRating.findOne({'course_id': req.body.courseid}, function(err, rating){
                if (err) { return err; }
                if (rating==null){
                    var newRating= new models.OverallRating({
                        "course_id": req.body.courseid,
                        "rating": 0,
                        "userCount": 0
                    });
                    newRating.save(function(err, newRating){if (err) throw err;});
                } else {
                    var theRating = rating.rating;
                    //rating.save(function(err, rating) {
                    //});

                }
                var data = {'newsfeed': stuff, 'courseID': req.body.courseid, 'rating': theRating};
                console.log(data);
                res.render('chat', data);

            });

        } else { console.log(err);}
    });

};