import Settings from '../config/settings';


var baseUrl = Settings.baseUrl + 'api/';
var	userApiUrl = baseUrl + 'users/';
var	rolesApiUrl = baseUrl + 'roles/';
var	sensorsApiUrl = baseUrl + 'sensors/';
var apiUser = {
	getAll(token, username){
		return fetch(userApiUrl, {
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
		return fetch(userApiUrl + id, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			})
		.then((response) => response.json());
	},
	getByEmail(email){
		return fetch(userApiUrl + email, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			})
		.then((response) => response.json());
	},
	add(user,token, username){
		return fetch(userApiUrl, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			},
			body: JSON.stringify(user)})
		.then((response) => response.json());
	},
	update(id, user, token, username){
		return fetch(userApiUrl + id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			},
			body: JSON.stringify(user)})
		.then((response) => response.json());
	},
	delete(id, token, username){
		return fetch(userApiUrl + id, {
			method: "DELETE",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			}})
		.then((response) => response.json());
	}
};

// var apiRole = {
	// getAll(){
		// return fetch(rolesApiUrl, {method: "GET"})
		// .then((response) => response.json());
	// },
	// getById(id){
		// return fetch(rolesApiUrl + id, {method: "GET"})
		// .then((response) => response.json());
	// },
	// getByName(name){
		// return fetch(rolesApiUrl + name, {method: "GET"})
		// .then((response) => response.json());
	// },
	// add(role){
		// return fetch(rolesApiUrl, {method: "POST", body: JSON.stringify(role)}) //not sure about this stringify
		// .then((response) => response.json());
	// },
	// update(id, role){
		// return fetch(rolesApiUrl  + id, {method: "PUT", body: JSON.stringify(role)})
		// .then((response) => response.json());
	// }
// };

// var apiSensor = {
	// getAll(){
		// return fetch(sensorsApiUrl, {method: "GET"})
		// .then((response) => response.json());
	// },
	// getById(id){
		// return fetch(sensorsApiUrl + id, {method: "GET"})
		// .then((response) => response.json());
	// },
	// getByName(name){
		// return fetch(sensorsApiUrl + name, {method: "GET"})
		// .then((response) => response.json());
	// },
	// add(sensor){
		// return fetch(sensorsApiUrl, {method: "POST", body: JSON.stringify(sensor)}) //not sure about this stringify
		// .then((response) => response.json());
	// },
	// update(id, sensor){
		// return fetch(sensorsApiUrl  + id, {method: "PUT", body: JSON.stringify(sensor)})
		// .then((response) => response.json());
	// },
	// switch(sensor){ // need name and state
		// return fetch(sensorsApiUrl + 'switch', {method: "POST", body: JSON.stringify(sensor)}) 
		// .then((response) => response.json());
	// }
// };

module.exports = apiUser;
// module.exports = apiRole;
// module.exports = apiSensor;
// function getAllUsers(){
	// var data= [];
	// fetch(userApiUrl, {method: "GET"})
		// .then((response) => response.json())
		// .then((responseData) => {
			// data = responseData
		// })
		// .done();
	// return data;
// }
