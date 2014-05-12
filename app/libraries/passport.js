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
    passport.use(new TwitterStrategy(config.vendor.twitter, function (req, accessToken, tokenSecret, profile, done) {
        if (req.user) {
            User.findOne({ $or: [
                {'twitter.id': profile.id },
                { username: profile.username },
                { email: profile.username + "@twitter.com" }]
            },
            function (err, existingUser) {
                if (existingUser) {
                    req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                    done(err);
                } else {
                    User.findById(req.user.id, function (err, user) {
                        user.email         = profile.username + "@twitter.com";
                        user.twitter       = profile._json;
                        user.photo_profile = profile._json.profile_image_url;
                        user.username      = profile.username;
                        user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });

                        user.save(function(err) {
                            req.flash('info', { msg: 'Twitter account has been linked.' });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({ 'twitter.id_str': profile.id }, function (err, existingUser) {
                if (existingUser) {
                    return done(null, existingUser);
                }

                var user = new User();

                // Twitter will not provide an email address.  Period.
                // But a person’s twitter username is guaranteed to be unique
                // so we can "fake" a twitter email address as follows:

                user.email         = profile.username + "@twitter.com";
                user.twitter       = profile._json;
                user.photo_profile = profile._json.profile_image_url;
                user.username      = profile.username;
                user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });

                user.save(function(err) {
                    done(err, user);
                });
            });
        }
    }));



    // Facebook Strategy
    passport.use(new FacebookStrategy(config.vendor.facebook, function(req, accessToken, refreshToken, profile, done) {
        if (req.user) {
            User.findOne({ $or: [
                { 'facebook.id' : profile.id },
                { username : profile.username},
                { email: profile.email }]
            },
            function (err, existingUser) {
                if (existingUser) {
                    req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                    done(err);
                } else {
                    User.findById(req.user.id, function (err, user) {
                        user.email         = profile._json.email;
                        user.facebook      = profile;
                        user.username      = profile.username;
                        user.facebook      = profile._json;
                        user.firstname     = user.firstname || profile.first_name;
                        user.lastname      = user.lastname || profile.last_name;
                        user.photo_profile = user.photo_profile || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                        user.tokens.push({ kind: 'facebook', accessToken: accessToken });

                        user.save(function(err) {
                            req.flash('info', { msg: 'Facebook account has been linked.' });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({ 'facebook.id' : profile.id }, function (err, existingUser) {
                if (existingUser) {
                    return done(null, existingUser);
                }

                User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
                    if (existingEmailUser) {
                        req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
                        done(err);
                    } else {
                        var user = new User();
                        user.email         = profile._json.email;
                        user.facebook      = profile;
                        user.username      = profile.username;
                        user.facebook      = profile._json;
                        user.firstname     = user.firstname || profile.first_name;
                        user.lastname      = user.lastname || profile.last_name;
                        user.photo_profile = user.photo_profile || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                        user.tokens.push({ kind: 'facebook', accessToken: accessToken });

                        user.save(function(err) {
                            done(err, user);
                        });
                    }
                });
            });
        }
    }));

}
