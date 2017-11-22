var baseUrl = 'http://192.168.0.105:3001/';

var	sensorsApiUrl = baseUrl + 'sensors/';

var apiSensor = {
	getAll(){
		return fetch(sensorsApiUrl, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		})
		.then((response) => response.json());
	},
	getById(id){
		return fetch(sensorsApiUrl + id, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			})
		.then((response) => response.json());
	},
	getByName(name){
		return fetch(sensorsApiUrl + name, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			})
		.then((response) => response.json());
	},
	add(sensor){
		return fetch(sensorsApiUrl, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sensor)})
		.then((response) => response.json());
	},
	update(id, sensor){
		return fetch(sensorsApiUrl  + id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sensor)})
		.then((response) => response.json());
	},
	switch(sensor){ // need name and state
	console.log(sensor);
		return fetch(sensorsApiUrl + 'switch', {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sensor)}) 
		//.then((response) => response.json());
		.then((response) => response.text())
		.then((responseData) => {console.log(responseData)})
		.catch(function(err) {console.log(err)});
		
	}
};

module.exports = apiSensor;