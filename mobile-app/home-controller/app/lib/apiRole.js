var baseUrl = 'http://192.168.0.105:3001/api/';
var	rolesApiUrl = baseUrl + 'roles/';

var apiRole = {
	getAll(){
		return fetch(rolesApiUrl, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
			})
		.then((response) => response.json());
	},
	getById(id){
		return fetch(rolesApiUrl + id, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			})
		.then((response) => response.json());
	},
	getByName(name){
		return fetch(rolesApiUrl + name, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},})
		.then((response) => response.json());
	},
	add(role){
		return fetch(rolesApiUrl, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(role)}
		.then((response) => response.json());
	},
	update(id, role){
		return fetch(rolesApiUrl  + id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(role)})
		.then((response) => response.json());
	}
};

module.exports = apiRole;