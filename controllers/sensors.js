var mongoose = require('mongoose');
var constants = require('../constants');
var helpers = require('../utils');
var connection = mongoose.createConnection(constants.DBUrl);

Sensor = connection.model('Sensor');
exports.findAll = function(req, res){
  Sensor.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  Sensor.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.findByName = function(req, res){
  var name = req.params.name;
  Sensor.findOne({'Name':name},function(err, result) {
    return res.send(result);
  });
};
exports.findByPinNumber = function(req, res){
  var pinNum = req.params.pinNum;
  Sensor.findOne({'PinNumber':pinNum},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
  Sensor.create(req.body, function (err, sensor) {
    if (err) return console.log(err);
    return res.send(sensor);
  });
}
exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  Sensor.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d Sensor', numberAffected);
      res.send(202);
  });
}
exports.delete = function(req, res){
  var id = req.params.id;
  Sensor.remove({'_id':id},function(result) {
    return res.send(result);
  });
};
exports.SwitchSensor = function(req, res){
  var pin = req.params.pin;
  var state = req.params.state;
	helpers.turn(pin,state);
  // Sensor.findOne({'Name':name},function(result) {
	  // if(!result.IsEnabled)
	  
	  
  // });
   return res.send(202);
};
exports.import = function(req, res){
	console.log("import initiated");
	Sensor.create(
    { "Name": "LED Green", "PinNameNumber": 17,"PinNumber": 0,"IsOutput": true,"IsEnabled": true},
	{ "Name": "LED Yellow", "PinNameNumber": 27,"PinNumber": 2,"IsOutput": true,"IsEnabled": true}, 
	{ "Name": "LED Red", "PinNameNumber": 22,"PinNumber": 3,"IsOutput": true,"IsEnabled": true}, 
 function (err) {
    if (err) return console.log(err);
    return res.sendStatus(202);
  });
};