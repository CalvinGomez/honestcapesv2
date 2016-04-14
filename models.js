var mongoose = require('mongoose');

var twitterUserSchema = new mongoose.Schema({
	"twitterID": String,
    "token": String,
    "username": String,
    "displayName": String,
    "photos": [ {"value": String } ]

}, {
	collection: "userdata"
});

var NewsFeedSchema= new mongoose.Schema({
    "user": String,
    "message": String,
    "course_id": String,
    "posted": Date,
    "photos": [ {"value": String } ]
},{
    collection: "comments"
});


var courseSchema = new mongoose.Schema({
	"name": String,
    "prof": String,
    "info": String,
    "number": Number  //UCSD's courseID

}, {
	collection: "courses"
});


var courseRatingSchema = new mongoose.Schema({
    "course_id": String,
    "rating": Number,
    "userCount": Number

}, {
	collection: "overallratings"
});

exports.User = mongoose.model('twitterUser',twitterUserSchema);
exports.theNews=mongoose.model('NewsFeed', NewsFeedSchema);
exports.Course = mongoose.model('courseDetail',courseSchema);
exports.OverallRating = mongoose.model('overallCourseRating',courseRatingSchema);