//Require Common Express modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

//Declare our app
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500).json({
			"Error": (err.status || 500)
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500).json({
		"Error": (err.status || 500)
	});
});

//Require our sayonaraConfig
var sayonaraConfig = require('./sayonaraConfig');

//Mongoose for MongoDB
var mongoose = require('mongoose');

//Models for mongoose
require('./models/permissions');
require('./models/users');

//Our api routes
var appAuth = require('./routes/auth');
app.use('/api/auth', appAuth);

//Connect to our DB
mongoose.connect(sayonaraConfig.dbUrl);
mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + sayonaraConfig.dbUrl);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected through ' + sayonaraConfig.dbUrl);
});

//Get our admin view
// The Admin App Root
app.get('/admin', function(req, res) {
	res.sendFile(path.resolve('../SayonaraAdmin/dist/index.html'));
});
//Relative paths for the admin app
//Regex for /admin/[anything here]
app.get(/(\/admin\/).*/, function(req, res) {
	var pathString = '../SayonaraAdmin/dist' + req.url.split('/admin')[1];
	res.sendFile(path.resolve(pathString));
});

//Serve the application
app.listen(sayonaraConfig.appPort);
console.log("App listening on port " + sayonaraConfig.appPort);

module.exports = app;
