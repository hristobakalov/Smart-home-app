var constants = require('../constants');
const http = require('http');
module.exports={
	getTemperature: function (ip, pin, callback) {
		console.log("Getting temperature: ", ip);
		if(!ip){
			ip = '192.168.1.199';
		}
		var url = 'http://' + ip + constants.ArduinoGetTemperatureRoute;
		http.get(url, (resp) => {
		  var data = '';
		 
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
			data += chunk;
		  });
		 
		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
			console.log(JSON.parse(data));
			callback(data);
		  });
		 
		}).on("error", (err) => {
			callback(null,err);
		  console.log("Error: " + err.message);
		});
	},
	
	getSoilMoisture: function (ip, pin, callback) {
		console.log("Getting SoilMoisture: ", ip);
		if(!ip){
			ip = '192.168.1.199';
		}
		var url = 'http://' + ip + constants.ArduinoGetSoilMoistureRoute;
		http.get(url, (resp) => {
		  var data = '';
		 
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
			data += chunk;
		  });
		 
		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
			console.log(JSON.parse(data));
			callback(data);
		  });
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		  callback(null,err);
		});
	},
	
	waterPlant: function (ip, pin, duration, callback) {
		console.log("Watering plant: ", ip);
		if(!ip){
			ip = '192.168.1.199';
		}
		var url = 'http://' + ip + constants.ArduinoWaterPlantRoute + duration;
		http.get(url, (resp) => {
		  var data = '';
		 
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
			data += chunk;
		  });
		 
		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
			console.log(JSON.parse(data));
			callback(data);
		  });
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		  callback(null,err);
		});
	},
}
