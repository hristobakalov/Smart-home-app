var mongoose = require('mongoose');
var constants = require('../constants');
var helpers = require('../utils');
var arduino = require('../utils/arduino');
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
  Sensor.findOne({'PinNameNumber':pinNum},function(err, result) {
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
  delete updates._id;

  Sensor.update({"_id":id}, updates,
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
exports.GetTemperature = function(req, res){
	var id = req.params.id;
	
	Sensor.findOne({'_id':id},function(err, result) {
		//console.log(result);
		if(result == null) {return res.sendStatus(400);}
		if(result.Type == "plant" ){
			 var pin = result.PinNameNumber;
			 var ip = result.Ip;
			 arduino.getTemperature(ip,pin, function(data,err){
				 if(err){
					 return res.sendStatus(500);
				 }
				 console.log(data);
				 return res.send(data);
			 });
			 
		 }
		 else{
			  return res.sendStatus(400);
		 }
  });
};
exports.GetSoilMoisture = function(req, res){
	var id = req.params.id;
	
	Sensor.findOne({'_id':id},function(err, result) {
		//console.log(result);
		if(result == null) {return res.sendStatus(400);}
		if(result.Type == "plant" ){
			 var pin = result.PinNameNumber;
			 var ip = result.Ip;
			 arduino.getSoilMoisture(ip,pin, function(data, err){
				  if(err){
					 return res.sendStatus(500);
				 }
				 console.log(data);
				 return res.send(data);
			 });
			 
		 }
		 else{
			  return res.sendStatus(400);
		 }
  });
};

exports.WaterPlant = function(req, res){
	var id = req.params.id;
	var duration = req.params.duration;
	if(!duration){
		duration = 5;
	}
	Sensor.findOne({'_id':id},function(err, result) {
		//console.log(result);
		if(result == null) {return res.sendStatus(400);}
		if(result.Type == "plant" ){
			 var pin = result.PinNameNumber;
			 var ip = result.Ip;
			 arduino.waterPlant(ip,pin, duration, function(data, err){
				  if(err){
					 return res.sendStatus(500);
				 }
				 console.log(data);
				 return res.send(data);
			 });
			 
		 }
		 else{
			  return res.sendStatus(400);
		 }
  });
};

exports.SwitchSensor = function(req, res){
	var name = req.body.name;
	console.log(name);
	Sensor.findOne({'Name':name},function(err, result) {
		console.log(result);
		if(result == null) {return res.send(400);}
		if(result.IsEnabled || true){ //temporary thing
			 var pin = result.PinNameNumber;
			 var state = req.body.state;
			 helpers.turn(pin,state);
			 return res.send(202);
		 }
		 else{
			  return res.send(400);
		 }
  });
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