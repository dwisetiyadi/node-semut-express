// Call dependencies
var common = require('./common');

/**
 * Expose routes
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('hello');
    });

    app.get('/foo', common.middleware('foo').bar, common.conroller('foo').bar);
}
