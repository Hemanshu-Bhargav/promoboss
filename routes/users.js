const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const { ensureAuthenticated, forwardAuthenticated } = require('../dbvalidation/auth');

//User model
const User = require('../dbschema/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));
// ForwardAuthenticated,

// Register Page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    // Check required fields, if not avail, push msg object
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
    //Check passwords match
    if (password != password2) {
      errors.push({ msg: 'Please ensure both passwords are the same' });
    }
  //Check password length
    if (password.length < 8) {
      errors.push({ msg: 'Password must be at least 8 characters' });
    }
    // if any of above errors are true (error len >0) then we want to rerender 
    // the register page (prompt user to try again), otherwise (else condition) go ahead
    // and register the user
    if (errors.length > 0) 
    { //Not only can we render register page, but also variables as well because we're using a template engine
      res.render('register', {
          //variables to pass are what needs correction from potential user
        errors,
        //Also need to pass in data that was entered correctly
        //Without this data passed, entire register form clears itself
        name,
        email,
        password,
        password2
      });
    } 
    else 
    {
        //Validation passed
        //Mongoose method that finds one record from MongoDb
        User.findOne({email: email})
        .then(user => {
            if(user){
                //if there's a user, rerender register form as above and send error
                errors.push({msg: 'This email belongs to another employee.'});
                res.render('register', {
                    //variables to pass are what needs correction from potential user
                  errors,
                  //Also need to pass in data that was entered correctly
                  //Without this data passed, entire register form clears itself
                  name,
                  email,
                  password,
                  password2
                });
            }
            else {
                //If there's isnt an user, create a new one
                const newUser = new User({
                    //pass in values for new instatiated User
                    name, //same as name: name, just shortened because ES6 JS allows this
                    email,
                    password
                });
                //Hash password w/ bcrypt
                //Generate a 'salt' w/gensalt to create a hash
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash; //plain-text password is now hashed
                    //Save User to MongoDB collection
                    newUser.save()
                        .then(user => {
                            //Pass express session flash error before redirect
                            req.flash('success_msg', 'Congrats! You can now access your company dashboard!');
                            res.redirect('/users/login'); //redirect to login page
                        }).catch(err => console.log(err));

                }))
            }
        });
    }

});

//Reroute the login screen & functionality
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Reroute the codemanager screen & functionality onclick of "codemanager button"
// found on code dashboard
// window.location="/users"
router.get('/codemanager', (req, res) => {
   res.render('codemanager'); //redirect to codemanager page
 });

// Reroute the logout screen & functionality onclick of "logout" button
// found on code dashboard
router.get('/logout', (req, res) => {
  req.logout(); //standard express middleware logout function
  req.flash('success_msg', 'You have logged out');
  res.redirect('/users/login'); //redirect to log out
});


// // Dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//   res.render('dashboard', {
//     user: req.user
//   })
// );

 module.exports = router;