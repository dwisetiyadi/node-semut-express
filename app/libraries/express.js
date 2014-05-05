// Call dependencies
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var multer         = require('multer');
var methodOverride = require('method-override');
var logger         = require('morgan');
var responseTime   = require('response-time');
var compression    = require('compression');
var favicon        = require('static-favicon');

/**
 * Expose express
 */
module.exports = function (http, express, env, config, app) {

    // Database
    if (config.db.autoconnect === true) {
        var connect = function () {
            var options = {
                server: {
                    socketOptions: {
                        keepAlive: 1
                    }
                },
                auto_reconnect: true
            };
            mongoose.connect(config.db.host, options);
        };
        connect();
        mongoose.connection.on('error', function (err) {
            console.error('✗ MongoDB Connection ' + err + '\n');
        }); // Error handler
        mongoose.connection.on('disconnected', function () {
            connect();
        }); // Reconnect when closed
    }


    var allowCrossDomain = function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Credentials', true)
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    }

    app.enable('trust proxy');
    app.disable('x-powered-by');

    app.use(favicon(config.path.public + '/img/favicon.ico'));
    app.use(bodyParser());
    app.use(multer());
    app.use(methodOverride());
    app.use(allowCrossDomain);


    // View
    app.set('views', config.path.app + '/views');
    app.set('view engine', 'jade');
    app.set('app', config);

    // Public
    app.use(express.static(config.path.public));

    // Routing
    var loader = require(config.path.app + '/libraries/loader');
    require(config.path.app + '/routes')(app, loader);


    // Error Handler
    // Check Environment
    if (app.get('env') === 'development') {
        app.use(logger('dev'));
        app.use(responseTime());
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('errors/general', {
                heading: err.status || 500,
                message: err.stack
            });
        });
        app.locals.pretty = true;
    } else {
        app.use(logger());
        app.use(function (err, req, res, next) {
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
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        res.status(404).render('errors/404', {
            heading: '404 Page Not Found',
            message: 'The page you requested was not found.'
        });
    });


    // Run server
    var port = process.env.PORT || config.port;
    server   = http.createServer(app);
    server.listen(port, function (err) {
        if (err) {
            return console.trace(err);
        }
        console.log('\n==============================');
        console.log('Semut Express MVC');
        console.log('Started on port  : ' + port);
        console.log('With environment : ' + env);
        console.log('==============================\n');
    });
    server.on('error', function (err) {
        console.error('✗ PORT '+ port + ': ' + err);
    });
};
