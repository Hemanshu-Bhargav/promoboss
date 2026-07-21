const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../dbvalidation/authenticator');

// User model
const User = require('../dbschema/User');

// Login Page (Protected with forwardAuthenticated so logged-in users bypass login)
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page (Protected with forwardAuthenticated)
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register Handle
router.post('/register', forwardAuthenticated, (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }
    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Please ensure both passwords are the same' });
    }
    // Check password length
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        return res.render('register', {
            errors,
            name,
            email
        });
    }

    // Validation passed - Check if user already exists
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                errors.push({ msg: 'This email belongs to another employee.' });
                return res.render('register', {
                    errors,
                    name,
                    email
                });
            }

            // Create a new user instance
            const newUser = new User({
                name,
                email,
                password
            });

            // Hash password w/ bcrypt
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.error(err);
                    return res.status(500).render('register', { errors: [{ msg: 'Server error during registration' }], name, email });
                }

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).render('register', { errors: [{ msg: 'Server error during registration' }], name, email });
                    }

                    newUser.password = hash;

                    // Save User to MongoDB collection
                    newUser.save()
                        .then(() => {
                            req.flash('success_msg', 'Congrats! You can now access your company dashboard!');
                            res.redirect('/users/login');
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).render('register', { errors: [{ msg: 'Database save error' }], name, email });
                        });
                });
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('register', { errors: [{ msg: 'Database query error' }], name, email });
        });
});

// Login functionality
router.post('/login', forwardAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Codemanager Page (Protected with ensureAuthenticated)
router.get('/codemanager', ensureAuthenticated, (req, res) => {
    res.render('codemanager', {
        user: req.user
    });
});

// Logout functionality
router.get('/logout', ensureAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'You have logged out');
        res.redirect('/users/login');
    });
});

module.exports = router;
