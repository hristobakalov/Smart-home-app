var express = require('express'),
bodyParser = require('body-parser')
mongoose = require('mongoose'),
fs = require('fs');

//MongoDB url -> if folder doesn't exist, it will be created
var mongoUri = 'mongodb://localhost/db';
var connection = mongoose.createConnection(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});

var app = express();

 //parsing to handle post requests
// app.configure(function(){
// app.use(express.bodyparser());
// });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



//requiring models
require('./models/Role');
require('./models/Sensor');
require('./models/User');
require('./models/UserRoleRelation');
require('./models/RoleSensorRelation');

//requiring routes
//require('./routes');
app.use('/', require('./routes'));
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
//app.all('/api/*', [require('./middleware/validateRequest')]);
// app.use('/', require('./routes'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3001);
console.log('Listening on port 3001...');