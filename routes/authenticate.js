const express = require('express');
const router = express.Router();

module.exports = function (passport) {

	//sends successful login state back to angular
	router.get('/success', function (req, res) {
		res.send({
			state: 'success'
		});
	});

	//sends failure login state back to angular
	router.get('/failure', function (req, res) {
		res.send({
			state: 'failure',
			user: null,
			message: 'Invalid username or password'
		});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//log out
	router.get('/signout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;

};