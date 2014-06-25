exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
    	return next();
    }
    res.redirect('/signin');
}

exports.isUnauthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
    	res.redirect('/dashboard');
    }
    return next();
}