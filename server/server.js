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
require('./routes')(app);

app.listen(3001);
console.log('Listening on port 3001...');