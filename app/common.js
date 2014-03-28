// Call dependencies
var env    = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/app')[env];

/**
 * Expose common
 */
module.exports = {
    model : function (callFile) {
        var modelPath = config.path.app + '/models/' + callFile + '.js';
        return require(modelPath);
    },
    middleware: function (callFile) {
        var middlewarePath = config.path.app + '/middlewares/' + callFile + '.js';
        return require(middlewarePath);
    },
    controller: function (callFile) {
        var controllerPath = config.path.app + '/controllers/' + callFile + '.js';
        return require(controllerPath);
    }
};
