/**
 * Expose routes
 */
module.exports = function (app, common) {
    app.get('/', common.middleware('foo').bar, common.controller('hello').world);
};
