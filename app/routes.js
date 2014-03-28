// Call dependencies
var common = require('./common');

/**
 * Expose routes
 */
module.exports = function (app) {
    app.get('/foo', common.middleware('foo').bar, common.controller('hello').world);
}
