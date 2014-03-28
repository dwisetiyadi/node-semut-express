// Call dependencies
var common = require('./common');

/**
 * Expose routes
 */
module.exports = function (app) {
    app.get('/', common.middleware('foo').bar, common.controller('hello').world);
}
