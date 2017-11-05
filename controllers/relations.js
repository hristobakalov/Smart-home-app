var mongoose = require('mongoose');
var constants = require('../constants');
var connection = mongoose.createConnection(constants.DBUrl);

RoleSensorRelations = connection.model('RoleSensorRelation');
UserRoleRelations = connection.model('UserRoleRelation');
Roles = connection.model('Role');

exports.findAllRoleSensorRelations = function(req, res){
  RoleSensorRelations.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findAllUserRoleRelations = function(req, res){
  UserRoleRelations.find({},function(err, results) {
    return res.send(results);
  });
};
//not needed right now
// exports.findallUsersByRoleId = function(req, res){
  // var id = req.params.id;
  // UserRoleRelations.where({'RoleId':id},function(err, result) {
	  
    // return res.send(result);
  // });
// };

exports.findRoleByUserId = function(req, res){
  var id = req.params.id;
  UserRoleRelations
   .findOne({'UserId':id},function(err, relation) {
	   if (err){
		   console.log(err);
		   return res.status(500).send(err);
		   }
		   if(!relation){
			   return res.status(404).send("Not found");
		   }
	   Role.findOne({'_id':relation.RoleId},function(err, result) {
		   if (err){
		   console.log(err);
		   return res.status(500).send(err);
		   }
    return res.send(result);
	});
  });
	// .findOne({'UserId':id})
	// .populate('Role')
	// .exec(function(err, role) {
		// console.log("you are in findRoleByUserId");
		// console.log(role);
		// if (err) return console.log(err); 
		// return res.send(role);
  // });
 
};
exports.addUserRole = function(req, res) {
  UserRoleRelations.create(req.body, function (err, userRoleRelations) {
    if (err) return console.log(err);
    return res.send(userRoleRelations);
  });
}
exports.updateRoleByUserId = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  UserRoleRelations.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d UserRoleRelations', numberAffected);
      res.send(202);
  });
}
exports.delete = function(req, res){
  var id = req.params.id;
  UserRoleRelations.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
	console.log("import initiated");
	UserRoleRelations.create(
    { "UserId": "LED Green", "RoleId": 17},
 function (err) {
    if (err) return console.log(err);
    return res.sendStatus(202);
  });
};