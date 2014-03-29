// Call dependencies
var path     = require('path');
var appPath = path.normalize(__dirname + '/..');

/**
 * Expose common
 */
module.exports = {
    model : function (callFile) {
        var modelPath = appPath + '/models/' + callFile + '.js';
        return require(modelPath);
    },
    middleware: function (callFile) {
        var middlewarePath = appPath + '/middlewares/' + callFile + '.js';
        return require(middlewarePath);
    },
    controller: function (callFile) {
        var controllerPath = appPath + '/controllers/' + callFile + '.js';
        return require(controllerPath);
    }
};
