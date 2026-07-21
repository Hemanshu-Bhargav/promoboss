const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../dbschema/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
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
            // SECURITY FIX: Omit raw passwords from being passed back to the view
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

                    newUser.password = hash; // Plain-text password is now hashed

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
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Codemanager Page
router.get('/codemanager', (req, res) => {
    res.render('codemanager');
});

// Logout functionality (Updated for Passport v0.6+)
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'You have logged out');
        res.redirect('/users/login');
    });
});

// Dashboard (Uncomment when ready)
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//    res.render('dashboard', {
//      user: req.user
//    })
// );

module.exports = router;
