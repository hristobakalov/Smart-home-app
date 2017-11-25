var mongoose = require('mongoose');
var constants = require('../constants');
var connection = mongoose.createConnection(constants.DBUrl);

Role = connection.model('Role');
exports.findAll = function(req, res){
  Role.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  Role.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.findByName = function(req, res){
  var name = req.params.name;
  Role.findOne({'Name':name},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
  Role.create(req.body, function (err, role) {
    if (err) return console.log(err);
    return res.send(role);
  });
}
exports.update = function(req, res) {
	var id = req.params.id;
	var updates = req.body;
	delete updates._id;
  Role.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d Role', numberAffected);
      res.send(202);
  });
}
exports.delete = function(req, res){
  var id = req.params.id;
  Role.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
	console.log("import initiated");
	Role.create(
    { "Name": "Administrator"},
 function (err) {
    if (err) return console.log(err);
    return res.sendStatus(202);
  });
};
