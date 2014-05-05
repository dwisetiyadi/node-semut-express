var path     = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    development: {
        port: 3000,
        db: {
            host: 'mongodb://localhost/',
            autoconnect: true
        },
        path: {
            root: rootPath,
            app: rootPath + '/app',
            public: rootPath + '/public'
        }
    },
    production: {
        port: 3000,
        db: {
            host: 'mongodb://localhost/',
            autoconnect: true
        },
        path: {
            root: rootPath,
            app: rootPath + '/app',
            public: rootPath + '/public'
        }
    },
    test: {
        port: 3000,
        db: {
            host: 'mongodb://localhost/',
            autoconnect: true
        },
        path: {
            root: rootPath,
            app: rootPath + '/app',
            public: rootPath + '/public'
        }
    }
};
