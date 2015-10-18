'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
var server = app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('ArchTech started on port ' + config.port);



var socket = require('./config/socket');

// Load Socket.io application
var io = socket.listen(server);

// Load routes and pass in Socket.io
app.loadRoutes(io);


// Socket.io logging initialization
console.log('Socket.io started on port ' + config.port);
