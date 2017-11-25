var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var constants = require('../constants');
var connection = mongoose.createConnection(constants.DBUrl);

User = connection.model('User');

var auth = {
 
  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    // Fire a query to your DB and check if the credentials are valid
    var dbUserObj = auth.validate(username, password, res);
	
	// console.log(dbUserObj);
    // if (!dbUserObj) { // If authentication fails, we send a 401 back
      // res.status(401);
      // res.json({
        // "status": 401,
        // "message": "Invalid credentials"
      // });
      // return;
    // }
 
    // if (dbUserObj) {
 
      // // If authentication is success, we will generate a token
      // // and dispatch it to the client
 
      // res.json(genToken(dbUserObj));
    // }
 
  },
 
  validate: function(username, password, res) {
	user = {};
	User.findOne({'Email':username},function(err, user) {
			if(err){
				console.log(err);
				 res.status(401);
				res.json({
					"status": 401,
					"message": "Invalid credentials"
				  });
				return false;
			}
			if(!user || password != user.Password)
			{
				 res.status(401);
				res.json({
					"status": 401,
					"message": "Invalid credentials"
				  });
				return false;
			}
			//user ["Role"] = "Administrator"; //temporary hardcoded role;
			var resultObj = user.toObject();
				resultObj.Role ="Administrator";
			  res.json(genToken(resultObj));
			//console.log(user);
			return user;
	});
    // var dbUserObj = { // spoofing a userobject from the DB. 
      // name: 'arvind',
      // role: 'admin',
      // username: 'arvind@myapp.com'
    // };
 
    // return dbUserObj;
  },
 
  validateUser: function(username) {
		User.findOne({'Email':username},function(err, result) {
			if(err){
				console.log(err);
				return false;
			}
			
			if(!result) 
			{
				return false;
			}
			result["Role"] = "Administrator"; //temporary hardcoded role;
			return result;
			
		});
  },
}
 
// private method
function genToken(user) {
  var expires = expiresIn(14); // 14 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());
 
  return {
    token: token,
    expires: expires,
    user: user
  };
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;