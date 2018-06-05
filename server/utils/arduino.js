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
			console.log(JSON.parse(data).explanation);
		  });
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}
}
function getTemperature (ip, pin) {
	console.log("Getting temperature: ", ip);
	// if(!ip){
		ip = '192.168.0.199';
	//}
    http.get(ip + constants.ArduinoGetTemperatureRoute, (resp) => {
	  var data = '';
	 
	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
		data += chunk;
	  });
	 
	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {
		console.log(JSON.parse(data).explanation);
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
}