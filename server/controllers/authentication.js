var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var constants = require('../constants');
var helpers = require('../utils');
var connection = mongoose.createConnection(constants.DBUrl);

User = connection.model('User');
Relations = connection.model('UserRoleRelation');
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
	
	helpers.cryptPassword(password, encryptedPassword);
	helpers.comparePassword(password, '$2a$10$aHMmBjBFTcBCL6wO.pGrTONmXHvVu/ikBESc99q8HIBgg4tr1E22y', comparyPasswords)
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
			
			if(!user)
			{
				console.log('Invalid credentials');
				 res.status(401);
				res.json({
					"status": 401,
					"message": "Invalid credentials"
				  });
				return false;
			}
			helpers.comparePassword(password, user.Password, (err, arePasswordsMatching) => {
						if(err)
				console.log(err);
			
			console.log(arePasswordsMatching);
			if(!arePasswordsMatching || err){
				console.log('Invalid credentials');
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
					UserRoleRelations.findOne({'UserId':resultObj._id},function(err, relation) {
						if (err){
						   console.log("user relation failer: ", err);
						   res.json({
							"status": 500,
							"message": "Something wrong with relations"
						  });
						   return false;
						}
						if(!relation){
						  console.log("user relation not found");
						}
						resultObj.Role =relation.RoleId;
						console.log(resultObj);
						res.json(genToken(resultObj));
						console.log(resultObj);
						return resultObj;
					});
			})
			
			
	});
    // var dbUserObj = { // spoofing a userobject from the DB. 
      // name: 'arvind',
      // role: 'admin',
      // username: 'arvind@myapp.com'
    // };
 
    // return dbUserObj;
  },
 
  validateUser: function(username, req, res, next) {
		User.findOne({'Email':username},function(err, result) {
			if(err){
				console.log(err);
				 res.status(500);
				  res.json({
					"status": 500,
					"message": "Oops something went wrong",
					"error": err
				  });
				return false;
			}
			if(!result) 
			{
				res.status(401);
				res.json({
					"status": 401,
					"message": "Invalid User"
				});
				return false;
			}
			
			var resultObj = result.toObject();//temporary hardcoded role;
				resultObj.Role ="Administrator";
				
			  if ((req.url.indexOf('api') >= 0 && resultObj.Role == 'Administrator')) {
				next(); // To move to next middleware
			  }else {
				  res.status(403);
				  res.json({
					"status": 403,
					"message": "Not Authorized"
				  });
				  return;
				}
			return result;
			
		});
  },
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
function encryptedPassword(err, hash){
	if(err)
		console.log(err);
	
	console.log(hash);
}

function comparyPasswords(err, arePasswordsMatching, res, genToken){
	if(err)
		console.log(err);
	
	console.log(arePasswordsMatching);
	if(!arePasswordsMatching || err){
		console.log('Invalid credentials');
				 res.status(401);
				res.json({
					"status": 401,
					"message": "Invalid credentials"
				  });
				return false;
	}
	//user ["Role"] = "Administrator"; //temporary hardcoded role;
			var resultObj = user;
				resultObj.Role ="Administrator";
			UserRoleRelations.findOne({'UserId':resultObj._id},function(err, relation) {
				if (err){
				   console.log("user relation failer: ", err);
				   res.json({
					"status": 500,
					"message": "Something wrong with relations"
				  });
				   return false;
				}
				if(!relation){
				  console.log("user relation not found");
				}
				resultObj.Role =relation.RoleId;
				console.log(resultObj);
				res.json(genToken(resultObj));
				console.log(resultObj);
				return resultObj;
			});
}

// private method
function genToken(user) {
  //var jwt = require('jwt-simple');
  var expires = expiresIn(14); // 14 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());
 console.log(token);
  return {
	  loginData:{
		    token: token,
			expires: expires,
			user: user
	  }
   
  };
}
module.exports = auth;