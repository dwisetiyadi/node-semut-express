// Call dependencies
var loader = require('../libraries/loader');
var config = loader.config();
var User   = loader.model('User');

/**
 * Expose Passport
 */
module.exports = function (app, passport, LocalStrategy, TwitterStrategy, FacebookStrategy, req, res) {

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



    // Facebook Strategy
    passport.use(new FacebookStrategy({
            clientID: config.vendor.facebook.clientID,
            clientSecret: config.vendor.facebook.clientSecret,
            callbackURL: req.baseUrl + config.vendor.facebook.callbackURL
        }, function(accessToken, refreshToken, profile, done) {
        User.findOne({vendor.id : profile.id, vendor.provider : profile.provider}, function(err, existinguser) {
            if (err) {
                return done(err);
            }

            if (existinguser) {
                profile.accesstoken  = accessToken;
                profile.refreshtoken = refreshToken;
                existinguser.vendor  = profile;

                existinguser.save(function (err, saved) {
                    if (err) {
                        return done(err);
                    }
                    done(null, saved)
                });
            } else {
                var user = new User();

                user.email = profile._json.email;
                user.name  = profile.displayName;
                user.photo = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

                profile.accesstoken  = accessToken;
                profile.refreshtoken = refreshToken;
                user.vendor.push(profile);

                user.save(function (err, saved) {
                    if (err) {
                        return done(err);
                    }
                    done(null, saved)
                });
            }

            done(null, user);
        });
    }));



    // Twitter Strategy
    passport.use(new TwitterStrategy({
        consumerKey: config.vendor.facebook.twitter.consumerKey,
        consumerSecret: config.vendor.facebook.twitter.consumerSecret,
        callbackURL: req.baseUrl + config.vendor.facebook.twitter.callbackURL
    }, function(token, tokenSecret, profile, done) {
        User.findOne({vendor.id : profile.id, vendor.provider : profile.provider}, function(err, existinguser) {
            if (err) {
                return done(err);
            }

            if (existinguser) {
                profile.accesstoken  = token;
                profile.refreshtoken = tokenSecret;
                existinguser.vendor  = profile;

                existinguser.save(function (err, saved) {
                    if (err) {
                        return done(err);
                    }
                    done(null, saved)
                });
            } else {
                var user = new User();

                user.email = profile._json.email;
                user.name  = profile.displayName;
                user.photo = profile._json.profile_image_url;

                profile.accesstoken  = token;
                profile.refreshtoken = tokenSecret;
                user.vendor.push(profile);

                user.save(function (err, saved) {
                    if (err) {
                        return done(err);
                    }
                    done(null, saved)
                });
            }

            done(null, user);
        });
    }));
}
