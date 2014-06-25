/**
 * Expose routes
 */
module.exports = function (app, load) {

    // Example Routing
    app.get('/', load.middleware('foo').bar, load.controller('hello').world);



    /**
     * User Authentication Routing and Controlling
     */
    var passport = load.node('passport');

    // Sign In Control
    app.get('/signin', load.middleware('auth').isUnauthenticated, function (req, res) {
    	res.render('auth/signin', {
    		message: req.flash('error')
    	});
    })
    app.post('/signin',
    	passport.authenticate('local', {
    		successRedirect: '/dashboard',
    		failureRedirect: '/signin',
    		failureFlash: true
    	})
    )

    // Sign Out Control
    app.get('/signout', function (req, res) {
    	req.logout();
    	res.redirect('/');
    })

    // Dashboard for Authenticated User
    app.get('/dashboard', load.middleware('auth').isAuthenticated, function (req, res) {
        res.render('dashboard', {
            user: req.user
        });
    })

    // Seed User Data
    app.get('/user-one-seed', function (req, res) {
    	var User = load.model('User');
		var user = new User({ email: 'admin@example.com', password: '123456', name: 'Example User' });
		user.save(function(err) {
			if(err) {
				res.send(err)
			} else {
				res.send('user: ' + user.email + " saved.");
			}
		});
    });
};
