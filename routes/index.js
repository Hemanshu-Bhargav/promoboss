const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../dbvalidation/authenticator');

// Welcome Page (Protected with forwardAuthenticated so logged-in users bypass the welcome/login page)
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard Route (Protected)
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

// Code Management Page Route (Protected - matches the button link in the dashboard view)
router.get('/codemanager', ensureAuthenticated, (req, res) =>
  res.render('codemanager', {
    user: req.user
  })
);

// Logout Route (Handled in router to match dashboard logout button link /users/logout)
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
