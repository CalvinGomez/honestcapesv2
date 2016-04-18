var models = require("../models");

exports.view = function(req, res) {

	// var courseID = "570dc2b7e4b0cbcd095d62e4";
    // console.log(req.body.courseid);
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
                var arr = req.body.coursename.split("-");
                var course = {
                    "course_id": req.body.courseid,
                    "course_name": req.body.coursename,
                    "course_info": req.body.courseinfo,
                    "course_prof": req.body.courseprof,
                    "course_name_firstHalf": arr[0],
                    "course_name_secondHalf": arr[1],
                };
                var data = {'newsfeed': stuff.reverse(), 'course': course, 'rating': theRating};
                // console.log(data);
                res.render('chat', data);

            });

        } else { console.log(err);}
    });

};