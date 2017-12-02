import Settings from '../config/settings';


var baseUrl = Settings.baseUrl + 'api/';
var	rolesApiUrl = baseUrl + 'roles/';

var apiRole = {
	getAll(token, username){
		return fetch(rolesApiUrl, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
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
	add(role, token, username){
		return fetch(rolesApiUrl, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username,
			},
			body: JSON.stringify(role)})
		.then((response) => response.json());
	},
	update(id, role, token, username){
		return fetch(rolesApiUrl  + id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			},
			body: JSON.stringify(role)})
		.then((response) => response.json());
	}
};

module.exports = apiRole;