var loader = require('../libraries/loader');
var config = loader.config();
var User   = loader.model('User');

module.exports = function (app, passport, LocalStrategy, TwitterStrategy, FacebookStrategy) {

    // Serialize/deserialize user
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({ _id : id }, function (err, user) {
            done(err, user);
        });
    });

    // Local Strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({ email : email }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'Your are not registered before.' });
                }

                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                return done(null, user);
            });
        }
    ));



    // Twitter Strategy
    passport.use(new TwitterStrategy(config.vendor.twitter, function(token, tokenSecret, profile, done) {
        User.findOrCreate(..., function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }));



    // Facebook Strategy
    passport.use(new FacebookStrategy(config.vendor.facebook, function(accessToken, refreshToken, profile, done) {
        User.findOrCreate(..., function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }));
}
