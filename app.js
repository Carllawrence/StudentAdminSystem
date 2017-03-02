// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(expressSession);
var multer = require('multer');
var fs = require('fs');
var csv = require('ya-csv');

 var payslips = require('./models/payslip.js');
  Payslip = mongoose.model('Payslip');

var inputFile='./bankslips/samplePayslip.txt';

var reader = csv.createCsvFileReader('./bankslips/samplePayslip.txt', { 'separator': '|', });
reader.setColumnNames(['ncp', 'dco', 'dva', 'uti', 'pie', 'eve', 'ope', 'lib', 'debit', 'credit']);
reader.addListener('data', function (data) {

 var payslip = new Payslip(data);
 payslip.save();
 console.log(payslip);

});


// specify storage directory
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  // use original file name to save file
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },

// Filter only image files
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

var upload = multer({ storage: storage })

// connect to mongo using mongoose
mongoose.connect('mongodb://localhost/iprcdb', function (err, db) {
  if (!err) {
    console.log('Mongodb connected');
  } else if (err) {
    console.log('Mongo failed to connect');
  }
});

// user schema/model
var User = require('./models/user.js');

// create instance of express
var app = express();

//upload api 
app.post('/upload/', upload.single('file'), function (req, res, next) {
   // req.file is the image file name
  console.log(req.file);


  // use req.body to specify any text fields submitted with the image
  console.log(req.body);
 
 // return OK status 
  res.status(204).end();
})

app.post('/upload/appdocs/', upload.single('file'), function (req, res, next) {
   // req.file is the image file name
  console.log(req.file);
  // use req.body to specify any text fields submitted with the image
  console.log(req.body.name);
 
 // return OK status 
  res.status(204).end();
})


// initialize upload directory for upload api
app.use(express.static(path.join(__dirname, './uploads')));

// require routes
var routes = require('./routes/api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'rwanda kigali',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

// define passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport with session 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// define user routes
app.use('/user/', routes);

//define default route to serve index.html angular single page app
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// error hndlers
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
