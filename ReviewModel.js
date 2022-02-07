const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
	_reviewId: Schema.Types.ObjectId,
	_movieId: Schema.Types.ObjectId,
	username: {String, required: true},
	reviewType: [String],
	movieId: {type: String, required: true},
	date: (type: Date, required: true),
	score: {type: NumberInt, required: true},
	summary: {type: String},
	reviewText: {type: String}
});