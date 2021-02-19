const User = require('../models/user');

module.exports = {
    //register form
    renderRegister(req, res) {
        res.render('users/register')
    },

    //register user
    async register(req, res, next) {
        try {
            const { email, username, password } = req.body;
            const user = new User({ username, email });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err => {
                if (err) return next(err)
                req.flash('success', 'Welcome to Yelp-camp')
                res.redirect('/campgrounds')
            });
        } catch (e) {
            req.flash('error', e.message)
            res.redirect('/register')
        }
    },

    //login form
    renderLogin(req, res) {
        res.render('users/login')
    },

    //login user
    login(req, res) {
        req.flash('success', 'Welcome Back')
        const redirect = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirect)
    },

    //logout user
    logout(req, res) {
        req.logout();
        // req.session.destroy();
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    }

}