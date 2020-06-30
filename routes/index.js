const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../dbvalidation/authenticator');
// Commented out forwardAuthenticated middleware due to bug which defeats the purpose of authentication
// Welcome Page
router.get('/', (req, res) => res.render('welcome'));
//router.get('/dashboard', forwardAuthenticated, (req, res) => res.render('dashboard'));


// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

 module.exports = router;