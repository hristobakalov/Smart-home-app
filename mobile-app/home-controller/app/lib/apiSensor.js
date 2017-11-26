import Settings from '../config/settings';


var baseUrl = Settings.baseUrl + 'api/';

var	sensorsApiUrl = baseUrl + 'sensors/';

var apiSensor = {
	getAll(token, username){
		return fetch(sensorsApiUrl, {
				method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': token,
					'x-key': username
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
	update(id, sensor, token, username){
		return fetch(sensorsApiUrl  + id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			},
			body: JSON.stringify(sensor)})
		.then((response) => response.json());
	},
	switch(sensor , token, username){ // need name and state
	console.log(sensor);
		return fetch(sensorsApiUrl + 'switch', {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			},
			body: JSON.stringify(sensor)}) 
		//.then((response) => response.json())
		.then((response) => response.json());
		// .then((responseData) => {console.log(responseData)})
		// .catch(function(err) {console.log(err)});
		// .then((response) => response.text())
		// .then((responseData) => {console.log(responseData)})
		// .catch(function(err) {console.log(err)});
		
	}
};

module.exports = apiSensor;