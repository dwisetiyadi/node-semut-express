// Call dependencies
var env    = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/app')[env];

/**
 * Expose express configuration
 */
module.exports = function (express, app) {

    // Public
    app.use(express.static(config.path.public));

    // View
    app.set('views', config.path.app + '/views');
    app.set('view engine', 'jade');
    app.set('app', config);
}
