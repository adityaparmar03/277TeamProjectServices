
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , services = require('./routes/services')
  , friends = require('./routes/friends')
  , profile = require('./routes/profile')
  , settings = require('./routes/settings')
  , posts = require('./routes/posts')
  , http = require('http')
  , path = require('path');

var mongo = require("./routes/mongo"); 

var moongodbUrl = "mongodb://root:rootcmpe277db@ds133311.mlab.com:33311/cmpe277db";

var app = express();

// all environments
app.set('port', process.env.PORT || 5500);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/signup', services.signup);
app.post('/signin', services.signin);
app.post('/verifyotp', services.verify_otp);

app.post('/updateprofile', profile.profile_update);
app.get('/settings/:emailid', settings.getsettings);
app.post('/settings/update', settings.setsettings);
app.post('/posts/add', posts.addpost);
app.get('/posts/:emailid', posts.getpost);
app.post('/addFrndForExistingUser', friends.addFrndForExistingUser);
app.post('/addFrndForNewUser', friends.addFrndForNewUser);
app.get('/fetchPendingRequests/:emailid', friends.fetchPendingRequests) ;
app.get('/fetchSentRequests/:emailid', friends.fetchSentRequests) ;
app.post('/confirmPendingFrndRequest' , friends.confirmPendingFrndRequest ) ;
app.post('/rejectPendingFrndRequest', friends.rejectPendingFrndRequest) ;
app.get('/fetchFriendsDtls/:emailid' ,friends.fetchFriendsDtls) ;
app.post('/followUser' , friends.followUser) ;
app.post('/searchUsers' , user.searchUsers) ;
app.get('/displayPostsOfUser/:emailid' , user.displayPostsOfUser ) ;
app.post('/deleteSentRequest' , friends.deleteSentRequest ) ;
app.get('/getUserProfile/:emailid' , profile.getUserProfile ) ;
app.get('/getBasicUserProfile/:emailid' , profile.getBasicUserProfile ) ;
app.get('/publicProfiles' , user.publicProfiles) ;


var server = http.createServer(app);

//connect to the mongo collection session and then createServer
mongo.connect(moongodbUrl, function(db){
	global.db = db;
	console.log('Connected to mongo at: ' + moongodbUrl);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});


