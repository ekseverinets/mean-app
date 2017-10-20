const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
	text: String
});

const userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created from password
	created_at: {type: Date, default: Date.now}
});


mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);

module.exports.Post = mongoose.model('Post', postSchema);
module.exports.User = mongoose.model('User', userSchema);