var mongoose = require('mongoose');
var constants = require('../constants');
var connection = mongoose.createConnection(constants.DBUrl);

User = connection.model('User');
exports.findAll = function(req, res){
  User.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};

exports.import = function(req, res){
	console.log("import initiated");
	User.create(
    { "Email": "icaka@yahoo.com", "Password": "kur", "FirstName": "Icaka", "LastName": "Brat", "IsApproved" : false, "PasswordToken" :"" },
    { "Email": "icaka1@yahoo.com", "Password": "kur1", "FirstName": "Icaka1", "LastName": "Brat1", "IsApproved" : false, "PasswordToken" :"" },
 function (err) {
    if (err) return console.log(err);
    return res.sendStatus(202);
  });
};
