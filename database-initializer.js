const mongoose = require('mongoose');
const Movie = require("./MovieModel");
const UserAcct = require("./UserAcctModel");
const UserInfo = require("./UserInfoModel");
//const People = require("./PeopleModel");
//const Review = require("./ReviewModel");
const fs = require("fs");
let ObjectId = require('mongodb').ObjectID;

//const csv = require('csv-parse');
const results = [];

mongoose.connect('mongodb://localhost/t9', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped movie project database. Starting re-creation.");

		let movies = JSON.parse(fs.readFileSync("./movie-data/movie-data-1000.json"));
		let totalMovies = movies.length;
		let finishedMovies = 0;
		let countFail = 0;
		let countSuccess = 0;
		movies.forEach(movie => {
			movie.aveScore = 0;
			movie.reviewList = [];
			//console.log(movies);
			let m = new Movie(movie);
			m.save(function(err, callback){
				finishedMovies++;
				if(err){
					countFail++;
					console.log(err.message);
				}else{
					countSuccess++;
				}

				if(finishedMovies % 500 == 0){
					console.log("Finished movie #" + finishedMovies + "/" + totalMovies);
				}
				if(finishedMovies == totalMovies){
					mongoose.connection.close();
					console.log("Finished.");
					console.log("Successfully added: " + countSuccess);
					console.log("Failed: " + countFail);
					process.exit(0);
				}
			});
			
		});
		
		// create userAcct
		newUserAcct = new UserAcct({username:"user1", pword:"123", acctType:"contributing",
			followingP: [{"peopleName": "Francis Ford Coppola"}, {"peopleName": "J.K. Rowling"}],
			followingU: [{"userName":"user2"}]});
		newUserAcct.save(function(err) {
			if (err) return handleError(err);
			console.log("Saved a new user.");
		});
		newUserAcct = new UserAcct({username:"user2", pword:"123", acctType:"contributing",
			followingP: [{"peopleName": "Jon Voight"}, {"peopleName": "Faye Dunway"}],
			followingU:[{"userName":"user1"}]});
		newUserAcct.save(function(err) {
			if (err) return handleError(err);
			console.log("Saved a new user.");
		});
	});
});

//var movies = Movie.find({$where: "this.ratings.length > 10" });

//console.log(movies);