// Node.js Dependencies
const express = require("express");
const app = express();
const http = require("http").createServer(app);
// const io = require("socket.io")(http);
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

var mongoose = require('mongoose');
var passport = require('passport');
var handlebars = require('express-handlebars');


require("dotenv").load();
var models = require("./models");
var db = mongoose.connection;

//socket io
var io = require('socket.io')(http);

var router = { 
	index: require("./routes/index"),
	chat: require("./routes/chat"),
};


var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var strategy = {
	Twitter: require('passport-twitter').Strategy
};

// Database Connection
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URI);
db.on('error', console.error.bind(console, 'Mongo DB Connection Error:'));
db.once('open', function(callback) {
    console.log("Database connected successfully.");
});

// session middleware
var session_middleware = session({
    key: "session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: db })
});

// Middleware
app.set("port", process.env.PORT || 3000);
app.engine('html', handlebars());
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));





app.use(parser.cookie());
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());
app.use(require('method-override')());
app.use(session_middleware);
/* TODO: Passport Middleware Here*/

//app.use(session({ secret: 'anything' }));

app.use(passport.initialize());
app.use(passport.session());

//var loggedIn;
app.get('/logout', function( req, res){
    console.log("loggggging out")
    req.logOut();
    //loggedIn=false;
   // req.session.destroy();
    res.redirect('/');
    //res.clearCookie();
});

/* TODO: Use Twitter Strategy for Passport here */
passport.use(new strategy.Twitter({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
}, function(token, tokenSecret, profile, done) {

    // models.User.findOne({ "twitterID": profile.id }, function(err, user) {
    models.User.findOne({ "twitterID": profile.id }, function(err, user) {

    // (1) Check if there is an error. If so, return done(err);
    if (err)
        return done(err);
    if(!user) {
        // (2) since the user is not found, create new user.
        var newUser = new models.User({

        	"twitterID" : profile.id,
	        "token" : token,
	        "username" : profile.username,
	        "displayName" : profile.displayName,
	        "photos" : profile.photos
        });
        // console.log("New User:")
        // console.log(newUser)

        // save our user into the database
        newUser.save(function(err, newUser) {
                        if (err)
                        	// console.log(err.errors);
                            throw err;
                        return done(null, newUser);
                    });
    } else {
        // (3) since the user is found, update user’s information
        // var currentUser = new models.User({

        // 	"twitterID" : profile.id,
	       //  "token" : token,
	       //  "username" : profile.username,
	       //  "displayName" : profile.displayName,
	       //  "photos" : profile.photos
        // });
        // console.log("Current User:")
        // console.log(currentUser);
        process.nextTick(function() {
            return done(null, profile);
        });
    }
  });
  }
));
/* TODO: Passport serialization here */
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
// Routes
app.get("/", router.index.homepage);
app.get("/courses", router.index.courses);
// app.get("/homepage", router.index.homepage);
app.post("/chat", isAuthenticated, router.chat.view);
app.get("/results", router.index.rating);
/* TODO: Routes for OAuth using Passport */
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/courses',
                                     failureRedirect: '/' }));

function isAuthenticated(req, res, next) {

    
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    if (req.isAuthenticated()) {
        // req.user is available for use here
        return next(); }

    // denied. redirect to login
    res.redirect('/')
}

/*function isLoggedIn(passport, req, res, next) {

    // if user is authenticated in the session, carry on
    //console.log(req);
    var loggedIn = req.isAuthenticated();
    console.log("hihihihihi");
    console.log(loggedIn);
    if (loggedIn)
    {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}*/
// More routes here if needed
/*io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});*/

 io.use(function(socket, next) {
     session_middleware(socket.request, {}, next);
 });

/* TODO: Server-side Socket.io here */

/*io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });


});*/
io.on('connection', function(socket) {
    socket.on("chat message", function(msg) {
        var news = new models.theNews({
            "user": socket.request.session.passport.user.username,
            "message": msg.message,
            "course_id": msg.courseID,  //temp
            "photos" : socket.request.session.passport.user.photos,
            "posted": Date.now()
        });
        models.OverallRating.findOne({'course_id': msg.courseID}, function(err, rating){
            if (err) {return err;}
            rating.user_Count++;
            rating.rating=5;
            rating.save(function(err, rating) {
                if (err)
                // console.log(err.errors);
                    throw err;
                return rating;
            });

        });
        //console.log(socket.request.session.passport.user);
        //console.log(msg);

        news.save(function(err, news) {
            if (err)
            // console.log(err.errors);
                throw err;
        });

        io.emit("newsfeed", news);

    });

});




// Start Server
http.listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
