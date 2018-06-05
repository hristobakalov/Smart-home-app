var constants = require('../constants');
const http = require('http');
module.exports={
	getTemperature: function (ip, pin) {
		console.log("Getting temperature: ", ip);
		// if(!ip){
			ip = '192.168.0.199';
		//}
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
			return data;
		  });
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}
	
	getSoilMoisture: function (ip, pin) {
		console.log("Getting SoilMoisture: ", ip);
		// if(!ip){
			ip = '192.168.0.199';
		//}
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
			return data;
		  });
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		  return err;
		});
	}
}
