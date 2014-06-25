var path     = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    development: {
        port: 3000,
        db: {
            host           : 'mongodb://localhost',
            name           : 'semut-express',
            user           : '',
            password       : '',
            autoconnect    : true,
            auto_reconnect : true
        },
        session: {
            collection : 'sessions',
            expire     : 3600000
        },
        path: {
            root   : rootPath,
            app    : rootPath + '/app',
            public : rootPath + '/public'
        },
        vendor: {
            twitter: {
                consumerKey    : process.env.TWITTER_KEY || '',
                consumerSecret : process.env.TWITTER_SECRET  || '',
                callbackURL    : '/auth/twitter/callback'
            },
            facebook: {
                clientID     : process.env.FACEBOOK_ID || '',
                clientSecret : process.env.FACEBOOK_SECRET || '',
                callbackURL  : '/auth/facebook/callback'
            }
        },
        encryptionKey : 'keyboard cat'
    },
    production: {
        port: 3000,
        db: {
            host           : 'mongodb://localhost',
            name           : 'semut-express',
            user           : '',
            password       : '',
            autoconnect    : true,
            auto_reconnect : true
        },
        session: {
            collection : 'sessions',
            expire     : 3600000
        },
        path: {
            root   : rootPath,
            app    : rootPath + '/app',
            public : rootPath + '/public'
        },
        vendor: {
            twitter: {
                consumerKey    : process.env.TWITTER_KEY || '',
                consumerSecret : process.env.TWITTER_SECRET  || '',
                callbackURL    : '/auth/twitter/callback'
            },
            facebook: {
                clientID     : process.env.FACEBOOK_ID || '',
                clientSecret : process.env.FACEBOOK_SECRET || '',
                callbackURL  : '/auth/facebook/callback'
            }
        },
        encryptionKey : 'keyboard cat'
    },
    test: {
        port: 3000,
        db: {
            host           : 'mongodb://localhost',
            name           : 'semut-express',
            user           : '',
            password       : '',
            autoconnect    : true,
            auto_reconnect : true
        },
        session: {
            collection : 'sessions',
            expire     : 3600000
        },
        path: {
            root   : rootPath,
            app    : rootPath + '/app',
            public : rootPath + '/public'
        },
        vendor: {
            twitter: {
                consumerKey    : process.env.TWITTER_KEY || '',
                consumerSecret : process.env.TWITTER_SECRET  || '',
                callbackURL    : '/auth/twitter/callback'
            },
            facebook: {
                clientID     : process.env.FACEBOOK_ID || '',
                clientSecret : process.env.FACEBOOK_SECRET || '',
                callbackURL  : '/auth/facebook/callback'
            }
        },
        encryptionKey : 'keyboard cat'
    }
};
