const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

//Used for routes that must be authenticated.
function isAuthenticated(req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if (req.method === 'GET') {
		return next();
	}
	if (req.isAuthenticated()) {
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
}

//Register the authentication middleware
router.use('/posts', isAuthenticated);

//creates a new post
router.post('/posts', function (req, res) {
	console.log('debug');
	let post = {};
	post.text = req.body.text;
	post.created_by = req.body.created_by;
	post.created_at = Date.now();
	new Post(post).save(function (err, post) {
		if (err) {
			return res.status(500).send(err);
		}
		return res.json(post);
	});
});

//gets all posts
router.get('/posts', function (req, res) {
	console.log('debug1');
	Post.find(function (err, posts) {
		// console.log('debug2');
		if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).send(posts);
	});
});

//post-specific commands. likely won't be used
// router.route('/posts/:id')
// 	//gets specified post
// 	.get(function (req, res) {
// 		Post.findById(req.params.id, function (err, post) {
// 			if (err)
// 				res.send(err);
// 			res.json(post);
// 		});
// 	})

module.exports = router;