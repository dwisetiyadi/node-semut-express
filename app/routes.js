/**
 * Expose routes
 */
module.exports = function (app, loader) {
    app.get('/', loader.middleware('foo').bar, loader.controller('hello').world);
};
