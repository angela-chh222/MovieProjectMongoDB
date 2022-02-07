const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let peopleSchema = Schema({
	_peopleId: Schema.Types.ObjectId,
	name: {type: String, required: true},
	actorList: {[{actor: String}], required: true},
	directorList: {[{director: String}], required: true},
	writerList: {[{writer: String}], required: true},
	collabList: {[{collaborator: String}], required: true}
});