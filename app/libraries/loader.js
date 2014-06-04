// Call dependencies
var env      = process.env.NODE_ENV || 'development';
var config   = require('../config/app')[env];
var mongoose = require('mongoose');

/**
 * Expose Loader
 */
module.exports = {
    config: function (callFile) {
        if (typeof callFile === 'undefined') {
            var callFile = 'app';
        }
        var configPath = config.path.app + '/config/' + callFile;
        return require(configPath)[env];
    },
    helper: function (callFile) {
        var helperPath = config.path.app + '/helpers/' + callFile;
        return require(helperPath);
    },
    model: function(modelName) {
        var modelPath = config.path.app + '/models/' + modelName;
        require(modelPath);
        return mongoose.model(modelName);
    },
    controller: function (callFile) {
        var controllerPath = config.path.app + '/controllers/' + callFile;
        return require(controllerPath);
    },
    middleware: function (callFile) {
        var middlewarePath = config.path.app + '/middlewares/' + callFile;
        return require(middlewarePath);
    },
    database: function (host) {
        if (typeof host === 'undefined') {
            var host = config.db.host;
        }
        if (config.db.autoconnect === false) {
            var connect = function () {
                var options = {
                    server: {
                        socketOptions: {
                            keepAlive: 1
                        }
                    },
                    auto_reconnect: true
                };
                mongoose.connect(host, options);
            };
            if (mongoose.connection.readyState === 0) {
                connect();
            }
            mongoose.connection.on('error', function (err) {
                console.error('✗ MongoDB Connection ' + err + '\n');
            }); // Error handler
            mongoose.connection.on('disconnected', function () {
                connect();
            }); // Reconnect when closed
        }
    },
    node: function(nodeModule) {
        return require(nodeModule);
    }
};
