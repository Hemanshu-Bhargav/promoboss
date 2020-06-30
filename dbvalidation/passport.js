const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../dbschema/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Confirm user by checking against PromoBoss database
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
            //if the user is not registered as an employee in the PromoBoss Database
            //Then, pass null as error, false because user does not exist and an optional
            //message
          return done(null, false, { message: 'That email is not registered' });
        }

        // The password that the user just entered is not encrypted, check against
        // the password stored in the PromoBoss database for that specific user
        //password (parameter#1 is the password passed to LocalStrategy above)
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
              //same concept as above
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
//Straight from PassportJS documentation
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};