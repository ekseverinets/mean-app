const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
//initialize mongoose schemas
require('./models/models');
const api = require('./routes/api');
const authenticate = require('./routes/authenticate')(passport);
const mongoose = require('mongoose'); //add for Mongo support
mongoose.connect('mongodb://localhost/main-app'); //connect to Mongo
const app = express();

// app.use(logger('dev'));
app.use(session({
	secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authenticate);
app.use('/api', api);

app.use(express.static('public'));

app.use(favicon(`${__dirname}/public/images/favicon.ico`));
// //// Initialize Passport
const initPassport = require('./passport-init');
initPassport(passport);

app.get('/*', (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
})

app.listen(3000, () => {
	console.log('3000');
})