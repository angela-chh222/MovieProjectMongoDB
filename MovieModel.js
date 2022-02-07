const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectIdSchema = Schema.ObjectId;
const ObjectId = mongoose.Types.ObjectId;
//ObjectId = require('mongodb').ObjectID
let movieSchema = Schema({
	_movieId: {type:Schema.Types.ObjectId, auto: true},
	Poster: {type: String, required: true},
	Title: {type: String, required: true},
	Year: {type: Number, required: true},
	Rated: {type: String, required: true},
	Runtime: {type: String, required: true},
	Plot: {type: String, required: true},
	Genre: [String],
	Director: [String],
	Writer: [String],
	Actors: [String],
	aveScore: {type: Number},
	reviewList: [{username: String, movieId: String, movieTitle: String, score: Number, summary:String, reviewText: String, date: Date}]
});

module.exports = mongoose.model("Movie", movieSchema);