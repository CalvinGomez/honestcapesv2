var models = require("../models");

exports.view = function(req, res) {

	var courseID = "570dc2b7e4b0cbcd095d62e4";
    console.log(req.body.courseid);
    models.theNews.find({"course_id":courseID}, function(err, stuff){
        if (!err){
             //console.log(courseID);
            models.OverallRating.findOne({'course_id': courseID}, function(err, rating){
                if (err) { return err; }
                var theRating=rating.rating;
                //rating.save(function(err, rating) {
                //});
                var data = {'newsfeed': stuff, 'courseID': courseID, 'rating': theRating};
                console.log(data);
                res.render('chat', data);

            });

        } else { console.log(err);}
    });

};