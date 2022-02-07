const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userInfoSchema = Schema({
	_userId: Schema.Types.ObjectId,
	followingP: [String],
	followingU: [String],
	watchedMovieList: [Schema.Types.ObjectId],
	recommendationList: [Schema.Types.ObjectId],
	notificationsP: [String],
	notificationsU: [String]
	//reviews: [{}]
});

module.exports = mongoose.model("UserInfo", userInfoSchema);