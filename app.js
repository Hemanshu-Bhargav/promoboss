// Standard dependecies, middleware etc required by NodeJS
// Express is our main subframework within Nodejs, can be thought of as a subset of nodejs utilized for front-end development
const express = require('express');
//EJS is the template engine of choice. Other possible alternative are Pug and Handlebars. Template engines replace .html files
// They basically output the html, combined with dynamic JS variables from our express framework
const expressLayouts = require('express-ejs-layouts');
//mongoose connects and exports data to our mongodb database
const mongoose = require('mongoose');
//passport compares against user credentials against
const passport = require('passport');
// connect-flash and express-session store session data so that new user registration is properly stored and
// so that client-side validation occurs correctly
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
//Jquery new
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
// Passport Configuartion, see config folder
require('./dbvalidation/passport')(passport);

//DB Config, keys holds the MongoDB Atlas (cloud) cluster, and Hemanshu's password
// Password and Cluster info to be removed when handing in source code!
const db = require('./dbvalidation/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// launch the EJS handlers (templating engine which outputs html pages from expressJS)
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware, order is important, must be after session
// so that the registration process completes, but before flash
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables for coloured messages, sucess as green, errors as red
app.use(function(req, res, next) {
  //Success and error messages to be displayed during registration
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  //Error message to be displayed if a user who does not exist in PromoBoss database attempts to login
  res.locals.error = req.flash('error');
  next();
});

// Routing to default and to users directory
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
//app.use('/', require('./routes/index'));
const PORT = process.env.PORT || 5000;

//app.use("/indexv3", express.static('indexv3'))
//app.use(express.static(__dirname + '/PromoBoss 3 pages'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));
