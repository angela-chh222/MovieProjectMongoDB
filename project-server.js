const http = require("http");
const url = require("url");
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Movie = require("./MovieModel");
const UserAcct = require("./UserAcctModel");
const UserInfo = require("./UserInfoModel");
//let ObjectId = require('mongodb').ObjectID;
mongoose.connect('mongodb://localhost/t9', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
const Schema = mongoose.Schema;
const ObjectIdSchema = Schema.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('index', {"prompt": "Welcome to the movie database project!"});
});

app.get('/index', (req, res) => {
	res.render('index', {"prompt": "Welcome to the movie database project!"});
});

app.get('/signup', (req, res) => {
	res.render('signup', {"prompt":"Please create an account:"});
});

app.get('/editacct', (req, res) => {
	res.render('editacct', {"user": session.loggedInUser});
});

app.get('/searchmovie', (req, res) => {
	res.render('searchmovie', {"user": session.loggedInUser});
});

app.get('/contribute', (req, res) => {
	res.render('contribute', {"user": session.loggedInUser});
});

app.get('/viewmovie', (req, res) => {
	// get parameter from URL
	var queryObject = url.parse(req.url, true).query;
	console.log(queryObject);
	var movieId = queryObject.movieId;
	console.log("view movie: " + movieId);
	// search movie with movieId
	var myquery = {};
	myquery._movieId = movieId;
	Movie.find(myquery, function(err, movieList) {
		if(err){
			console.log("Movie not found.");
			res.render('viewMovie', {"hasMovie":[]});
		}
		else {
			if (movieList.length === 0) {
				console.log("No movie found.");
				res.render('viewMovie',{"hasMovie":[]});
			}
			else {
				console.log("Movie found." + movieList.length);
				res.render('viewMovie', {"hasMovie":[1], "movie": movieList[0]});
			}
		}
	});
});

app.get('/viewperson', (req, res) => {
	var queryObject = url.parse(req.url, true).query;
	var personName = queryObject.name;
	console.log("viewperson Person name: " + personName);
	// search movies for person's name

	Movie.find({$or: [{"Director":personName}, {"Writer":personName}, {"Actors": personName}]}, function(err, movieList) {
		if(err){
			console.log("Person not found.");
			res.render('viewperson', {"hasMovie": [0], "personName": personName, "directors": [], "writers": [], "actors": []});
		}
		else {
			if (movieList.length === 0) {
				console.log("No person found. 0");
				res.render('viewperson',{"hasMovie": [0], "personName": personName, "directors": [], "writers": [], "actors": []});
			}
			else {
				var directors = [];
				var writers = [];
				var actors = [];
				for (var i = 0; i < movieList.length; i++) {
					for (var j = 0; j < movieList[i].Director.length; j++) {
						if (directors.includes(movieList[i].Director[j]) == false) {
							directors.push(movieList[i].Director[j]);
						}
					}
					for (var j = 0; j < movieList[i].Writer.length; j++) {
						if (writers.includes(movieList[i].Writer[j]) == false) {
							writers.push(movieList[i].Writer[j]);
						}
					}
					for (var j = 0; j < movieList[i].Actors.length; j++) {
						if (actors.includes(movieList[i].Actors[j]) == false) {
							actors.push(movieList[i].Actors[j]);
						}
					}
				}
				var directorMoviesList = [];
				var writerMoviesList = [];
				var actorMoviesList = [];
				for (var i = 0; i < movieList.length; i++) {
					if (movieList[i].Director.includes(personName) == true) {
						directorMoviesList.push({"_movieId": movieList[i]._movieId, "Title": movieList[i].Title});
					}
					if (movieList[i].Writer.includes(personName) == true) {
						writerMoviesList.push({"_movieId": movieList[i]._movieId, "Title": movieList[i].Title});
					}
					if (movieList[i].Actors.includes(personName) == true) {
						actorMoviesList.push({"_movieId": movieList[i]._movieId, "Title": movieList[i].Title});
					}
				}
				console.log("Person found." + movieList.length);
				res.render('viewperson', {"hasMovie":[1], "personName": personName, "directors": directorMoviesList, "writers": writerMoviesList, "actors": actorMoviesList});
			}
		}
	});
});

app.get('/viewuser', (req, res) => {
	// get username for ?username=xxxx in url
	
	// find the user from UserAcct database
	
	// display user info 
	res.render('viewuser', {"user": session.loggedInUser});
});

app.post('/searchresult', (req, res) => {
	console.log("body: " + req.body);
	var title = req.body.Title;
	var genre = req.body.Genre;
	var actor = req.body.Actor;
	console.log("Title: " + title);
	console.log("Genre: " + genre);
	console.log("Actor: " + actor);
	// search for a movie
	var myquery = {};
	if (genre.length != 0) {
		//myquery = {"Genre": genre};
		myquery.Genre = genre;
	}
	if (title.length != 0) {
		//myquery = {"Genre": genre};
		myquery.Title = title;
	}
	if (actor.length != 0) {
		//myquery = {"Genre": genre};
		myquery.Actors = actor;
	}
	Movie.find(myquery, function(err, movieList) {
		if(err){
			console.log("No movie found.");
			res.render('searchresult', {"hasMovie":[]});
		}
		else {
			//console.log(movieList);
			if (movieList.length === 0) {
				console.log("No movie found.");
				res.render('searchresult',{"hasMovie":[]});
			}
			else {
				console.log("Movie found." + movieList.length);
				res.render('searchresult', {"hasMovie":[1], "movieList": movieList});
			}
		}
	});
});

app.get('/addMovietoWatchlist', (req, res) => {
	var queryObject = url.parse(req.url, true).query;
	//console.log(queryObject);
	var movieId = queryObject.movieId;
	var title = queryObject.title;
	console.log("Title: " + title);
	console.log("MovieId: " + movieId);
	var movieWatchedList = {"movieId": movieId, "movieTitle": title};
	session.loggedInUser.watchedMovieList.push(movieWatchedList);
	console.log("watchedMovieList: " + session.loggedInUser.watchedMovieList);

	//update user reviews in user database
	UserAcct.updateOne({"username": session.loggedInUser.username},  {"watchedMovieList": session.loggedInUser.watchedMovieList}, function(err, result) {
		if (err) throw err;
		console.log("watchedMovieList updated: " + session.loggedInUser.watchedMovieList);
		res.render('addmovie', {"user": session.loggedInUser});
	});	
});

app.get('/addactor', (req, res) => {
	res.render('addactor', {"user": session.loggedInUser});
});

app.post('/addbasicreview', (req, res) => {
	var score = parseInt(req.body.score);
	var movieId = ObjectId(req.body.movieId);
	var username = session.loggedInUser.username;
	console.log("Basic review added. Score: " + score + "/10 movieId: " + movieId + " username: " + username);
	var myquery = {};
	myquery._movieId = movieId;
	var summary = "";
	var reviewText = "";
	Movie.find(myquery, function(err, movieList) {
		if(err){
			console.log("Movie not found.");
			res.render('viewMovie', {"hasMovie":[]});
		}
		else {
			if (movieList.length === 0) {
				console.log("No movie found.");
				res.render('viewMovie',{"hasMovie":[]});
			}
			else {
				var reviewList = movieList[0].reviewList;
				reviewList.push({"username": username, "movieId": movieId, "Title": movieList[0].Title, "score": score, "summary": summary, "reviewText": reviewText, date: new Date()});
				console.log("Reviews: " + reviewList);
				// update reviewList
				var sum = 0;
				var review = 0;
				var average = 0;
				for (var i = 0; i < reviewList.length; i++) {
					sum = sum + reviewList[i].score;
				}
				average = sum/reviewList.length;
				average = average.toFixed(1);
				
				Movie.updateOne(myquery, {"reviewList": reviewList, "aveScore": average}, function(err, result) {
					if (err) throw err;
					var userReview = {"movieId": movieId, "movieTitle": movieList[0].Title, "score": score, "summary": summary, "reviewText": reviewText, date: new Date()};
					session.loggedInUser.reviews.push(userReview);
					//update user reviews in user database
					UserAcct.updateOne({"username": session.loggedInUser.username},  {"reviews": session.loggedInUser.reviews}, function(err, result) {
						if (err) throw err;
						console.log("User reviews: " + session.loggedInUser.reviews);
					});
				});
				//res.render('viewMovie', {"hasMovie":[1], "movie": movieList[0]});
				res.render('addreview', {"user": session.loggedInUser});
			}
		}
	});
});

app.post('/addfullreview', (req, res) => {
	var score = parseInt(req.body.score);
	var movieId = ObjectId(req.body.movieId);
	var username = session.loggedInUser.username;
	console.log("Basic review added. Score: " + score + "/10 movieId: " + movieId + " username: " + username);
	var myquery = {};
	myquery._movieId = movieId;
	var summary = req.body.summary;
	var reviewText = req.body.reviewText;
	console.log("Summary: " + summary);
	console.log("reviewText: " + reviewText);
	Movie.find(myquery, function(err, movieList) {
		if(err){
			console.log("Movie not found.");
			res.render('viewMovie', {"hasMovie":[]});
		}
		else {
			if (movieList.length === 0) {
				console.log("No movie found.");
				res.render('viewMovie',{"hasMovie":[]});
			}
			else {
				var reviewList = movieList[0].reviewList;
				reviewList.push({"username": username, "movieId": movieId, "Title": movieList[0].Title, "score": score, "summary": summary, "reviewText": reviewText, date: new Date()});
				console.log("Reviews: " + reviewList);
				// update reviewList
				var sum = 0;
				var review = 0;
				var average = 0;
				for (var i = 0; i < reviewList.length; i++) {
					sum = sum + reviewList[i].score;
				}
				average = sum/reviewList.length;
				average = average.toFixed(1);
				
				Movie.updateOne(myquery, {"reviewList": reviewList, "aveScore": average}, function(err, result) {
					if (err) throw err;
					var userReview = {"movieId": movieId, "movieTitle": movieList[0].Title, "score": score, "summary": summary, "reviewText": reviewText, date: new Date()};
					session.loggedInUser.reviews.push(userReview);
					//update user reviews in user database
					console.log("User account reviews: " + session.loggedInUser.reviews);
					UserAcct.updateOne({"username": session.loggedInUser.username}, {"reviews": session.loggedInUser.reviews}, function(err, result) {
						if (err) throw err;
						console.log("User reviews: " + session.loggedInUser.reviews);
					});
				});
				//res.render('viewMovie', {"hasMovie":[1], "movie": movieList[0]});
				res.render('addreview', {"user": session.loggedInUser});
			}
		}
	});});

app.get('/logout', (req, res) => {
	res.render('logout');
	session.loggedInUser = null;
});

app.get('/loggedin', (req, res) => {
	if (session.loggedInUser != null) {
		res.render('loggedin', {"user": session.loggedInUser});
	}
	else {
		console.log("User not found; please create an account.");
		res.render('index',{"prompt": "Invalid username or password! Please try again!"});
	}
	
	//res.send("wrong user");
});

app.post('/login', (req, res) => {
	console.log(req.url);
	console.log("body: " + req.body);
	var username = req.body.username;
	var pword = req.body.password;
	console.log("username: " + username);
	console.log("password: " + pword);
	// search UserAcct database to find a user account with username and pword
	UserAcct.find({'username': username, 'pword': pword},  function(err, result) {
		if(err){
			console.log("User not found; please create an account.");
			res.render('index',{"prompt": "Invalid username or password! Please try again!"});
			session.loggedInUser = null;
		}
		else {
			if (result.length === 0) {
				// user doesn't exist
				console.log("User not found; please create an account.");
				res.render('index',{"prompt": "Invalid username or password! Please try again!"});
				session.loggedInUser = null;
			}
			else {
				console.log("User found ");
				session.loggedInUser = result[0];
				console.log(session.loggedInUser);
/* 		        Movie.find({"Year": '1970'}, function(err, movieList) {
					console.log(movieList);
				}); */
				res.render('loggedin', {"user": session.loggedInUser});
			}
		}
	});
});

app.post('/signupconfirm', (req, res) => {
	console.log(req.url);
	var username = req.body.username;
	var pword = req.body.password;
	var acctType = req.body.acctType;
	console.log("username: " + username);
	console.log("password: " + pword);
	console.log("type: " + acctType);
	newuser = {"username": username, "pword": pword, "type": acctType};

	UserAcct.find({'username': username, 'pword': pword}, function(err, result) {
		if(err){
			res.render('signup', {"prompt": username + " already exists; please try a different username"});
		}
		else {
			if (result.length === 0) {
				newUserAcct = new UserAcct({'username': username, 'pword': pword, 'acctType': acctType});
				newUserAcct.save(function(err) {
					if (err) return handleError(err);
						console.log("Saved a new user.");
						res.render('signupconfirm');
				});
			}
			else {
				res.render('signup', {"prompt": username + " already exists; please try a different username"});
			}
		}
	});
});

app.post('/updateuser', (req, res) => {
	// get user type
	console.log(req.url);
	console.log("body: " + req.body);
	var acctType = req.body.acctType;
	console.log("type: " + acctType);
	//TODO: add user to user account database
	var myquery = {username: session.loggedInUser.username};
	var changeAcctType = { $set: {acctType: acctType}};
	UserAcct.updateOne(myquery, changeAcctType, function(err, result) {
		if (err) throw err;
		console.log("Account type updated.");
		session.loggedInUser.acctType = acctType;
		res.render('loggedin',  {"user": session.loggedInUser});
	});
});

//Start server
app.listen(3000, () => {
	console.log("Server listening at http://localhost:3000");
});

// Initialize database connection
//MongoClient.connect("mongodb://localhost/t9", function(err, client) {
//  if(err) throw err;

//  console.log("db connected");
  // Start server once Mongo is initialized
//  app.listen(3000);
// console.log("Listening on port 3000");
//});