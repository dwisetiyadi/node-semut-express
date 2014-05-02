// Call dependencies
var path     = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var env      = process.env.NODE_ENV || 'development';
var config   = require(rootPath + '/app/config/app')[env];
var mongoose = require('mongoose');

/**
 * Expose common
 */
module.exports = {
    model: function(modelName) {
        var modelPath = config.path.app + '/models/' + modelName;
        require(modelPath);
        return mongoose.model(modelName);
    },
    middleware: function (callFile) {
        var middlewarePath = config.path.app + '/middlewares/' + callFile;
        return require(middlewarePath);
    },
    controller: function (callFile) {
        var controllerPath = config.path.app + '/controllers/' + callFile;
        return require(controllerPath);
    }
};
