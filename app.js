// Call dependencies
var express  = require('express');
var http     = require('http');
var env      = process.env.NODE_ENV || 'development';
var config   = require(__dirname + '/app/config/app')[env];
var mongoose = require('mongoose');

var app  = express();
var port = process.env.PORT || config.port;


// Database
var connect = function () {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        },
        auto_reconnect:true
    };
    mongoose.connect(config.db, options);
};
connect();
mongoose.connection.on('error', function (err) {
  console.log(err)
}); // Error handler
mongoose.connection.on('disconnected', function () {
  connect()
}); // Reconnect when closed


// Express configuration
require(config.path.app + '/config/express')(express, app);


// Routing
require(config.path.app + '/routes')(app);


// Run server
app.server = http.createServer(app);
app.server.listen(port, function () {
    console.log('\nSemut Express MVC\nStarted on port: ' + port + '\nWith environment: ' + env)
})
