 var models = require("../models");

exports.view = function(req, res) {

	var courseID = "570dc2b7e4b0cbcd095d62e4"
    models.theNews.find({"course_id":courseID}, function(err, stuff){
        if (!err){
            // console.log(stuff);

            var data = {'newsfeed': stuff};
            //console.log(data);
            res.render('chat', data, courseID);
        } else { console.log(err);}
    });


};
