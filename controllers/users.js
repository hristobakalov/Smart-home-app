var mongoose = require('mongoose');
var constants = require('../constants');
var connection = mongoose.createConnection(constants.DBUrl);

User = connection.model('User');
exports.findAll = function(req, res){
  User.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  User.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
	console.log(req.body);
	var user = new User(req.body);
	user.save((err, createdTodoObject)=> {
		if(err) res.status(500).send(err);
		
		res.status(200).send(createdTodoObject);
		});
  // User.create(req.body, function (err, user) {
    // if (err) return console.log(err);
    // return res.send(user);
  // });
}
exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  User.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated User: ');
	  console.log(numberAffected);
      res.send(202);
  });
}
exports.delete = function(req, res){
  var id = req.params.id;
  User.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
	console.log("import initiated");
	User.create(
    { "Email": "icaka@yahoo.com", "Password": "kur", "FirstName": "Icaka", "LastName": "Brat", "IsApproved" : false, "PasswordToken" :"awd" },
    { "Email": "icaka1@yahoo.com", "Password": "kur1", "FirstName": "Icaka1", "LastName": "Brat1", "IsApproved" : false, "PasswordToken" :"wada" },
 function (err) {
    if (err) return console.log(err);
    return res.send(202);
  });
};
