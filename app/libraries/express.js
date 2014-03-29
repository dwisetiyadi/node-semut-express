// Call dependencies
var mongoose = require('mongoose');

/**
 * Expose express
 */
module.exports = function (http, express, config, app) {
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

    // Public
    app.use(express.static(config.path.public));

    // View
    app.set('views', config.path.app + '/views');
    app.set('view engine', 'jade');
    app.set('app', config);

    // Routing
    var common = require(config.path.app + '/libraries/common');
    require(config.path.app + '/routes')(app, common);


    // Run server
    var env    = process.env.NODE_ENV || 'development';
    var port   = process.env.PORT || config.port;
    app.server = http.createServer(app);
    app.server.listen(port, function () {
        console.log('\n==============================');
        console.log('Semut Express MVC');
        console.log('Started on port: ' + port);
        console.log('With environment: ' + env);
        console.log('==============================\n');
    });
};
