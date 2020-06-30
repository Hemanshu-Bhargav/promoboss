//This file controls the authentication of PromoBoss
// Ensures that simply navigating to /dashboard doesn't take one to that page
// User must be logged in using correct credentials
module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) { //All passportJS functions
        return next();
      }
      req.flash('error_msg', 'Oops! You must login to view your dashboard');
      res.redirect('/users/login');
    },
    // forwardAuthenticated: function(req, res, next) {
    //   if (!req.isAuthenticated()) {
    //     return next();
    //   }
    //   res.redirect('/dashboard');      
    // }
  };