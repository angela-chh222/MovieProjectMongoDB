const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userAcctSchema = Schema({
	username: {type: String, required: true},
	pword: {type: String, required: true},
	acctType: {type: String, required: true},
	followingP: [{peopleName: String}],
	followingU: [{userName: String}],
	watchedMovieList: [{movieId: Schema.Types.ObjectId, movieTitle: String}],
	recommendationList: [{movieId: Schema.Types.ObjectId, movieTitle: String}],
	notificationsP: [{peopleName:String}],
	notificationsU: [{userName: String}],
	reviews: [{movieId: String, movieTitle: String, score: Number, summary: String, reviewText: String, date: Date}]
});

module.exports = mongoose.model("UserAcct", userAcctSchema);