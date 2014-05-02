// Call dependencies
var mongoose     = require('mongoose');
var logger       = require('morgan');
var responseTime = require('response-time');
var compression  = require('compression');
var env          = process.env.NODE_ENV || 'development';

/**
 * Expose express
 */
module.exports = function (http, express, config, app) {

    app.set('env', env);

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
        console.log(err);
    }); // Error handler
    mongoose.connection.on('disconnected', function () {
        connect();
    }); // Reconnect when closed

    // Public
    app.use(express.static(config.path.public));

    // View
    app.set('views', config.path.app + '/views');
    app.set('view engine', 'jade');
    app.set('app', config);

    // Routing
    var loader = require(config.path.app + '/libraries/loader');
    require(config.path.app + '/routes')(app, loader);


    // Error Handler
    // Check Environment
    if (app.get('env') === 'development') {
        app.use(logger('dev'));
        app.use(responseTime());
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('errors/general', {
                heading: err.status || 500,
                message: err.stack
            });
        });
    } else {
        app.use(logger());
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('errors/general', {
                heading: err.status || 500,
                message: 'Internal Server Error'
            });
        });
        app.use(compression({
            filter: function (req, res) {
                return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
            },
            level: 9
        }));
    }
    // catch 404 and forwarding to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        res.status(404).render('errors/404', {
            heading: '404',
            message: 'Page Not Found'
        });
    });


    // Run server
    var env    = process.env.NODE_ENV || 'development';
    var port   = process.env.PORT || config.port;
    app.server = http.createServer(app);
    app.server.listen(port, function () {
        console.log('\n==============================');
        console.log('Semut Express MVC');
        console.log('Started on port  : ' + port);
        console.log('With environment : ' + env);
        console.log('==============================\n');
    });
};
