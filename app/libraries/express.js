// Call dependencies
var mongoose         = require('mongoose');
var bodyParser       = require('body-parser');
var multer           = require('multer');
var methodOverride   = require('method-override');
var logger           = require('morgan');
var responseTime     = require('response-time');
var compression      = require('compression');
var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy
var TwitterStrategy  = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var favicon          = require('serve-favicon');
var cookieParser     = require('cookie-parser');
var session          = require('express-session');
var MongoStore       = require('connect-mongo')({ session: session });
var flash            = require('express-flash');

/**
 * Expose Express
 */
module.exports = function (http, express, env, config, app) {

    var port = process.env.PORT || config.port;

    // Base URL
    app.use(function(req, res, next) {
        req.baseUrl = function () {
            return req.protocol + "://" + req.get('host') + (port == 80 || port == 443 ? '' : ':' + port);
        }
        return next();
    });

    // Passport
    require(config.path.app + '/libraries/passport')(app, passport, LocalStrategy, TwitterStrategy, FacebookStrategy);

    // Database
    if (config.db.autoconnect === true) {
        var connect = function () {
            var options = {
                server: {
                    socketOptions: {
                        keepAlive: 1
                    }
                },
                auto_reconnect: config.db.auto_reconnect
            };
            mongoose.connect(config.db.host + '/' + config.db.name, options);
        };
        connect();
        mongoose.connection.on('error', function (err) {
            console.error('✗ MongoDB Connection ' + err + '\n');
        }); // Error handler
        mongoose.connection.on('disconnected', function () {
            connect();
        }); // Reconnect when closed
    }


    // Allow Cross Domain
    var allowCrossDomain = function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Credentials', true)
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    }

    app.enable('trust proxy');
    app.disable('x-powered-by');

    app.use(favicon(config.path.public + '/img/favicon.ico'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(multer());
    app.use(methodOverride());
    app.use(allowCrossDomain);
    app.use(cookieParser(config.encryptionKey));
    app.use(session({
        secret: config.encryptionKey,
        store: new MongoStore({
            db             : config.db.name,
            collection     : config.session.collection,
            auto_reconnect : config.db.auto_reconnect
        }),
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session({
        maxAge: new Date(Date.now() + config.session.expire)
    }));
    app.use(flash());


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
                heading: err.status || 500 + ' Internal Server Error',
                message: err.stack
            });
        });
        app.locals.pretty = true;
    } else {
        app.use(logger());
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('errors/general', {
                heading: err.status || 500 + ' Internal Server Error',
                message: 'Something goes wrong, please tell your webmaster.'
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
