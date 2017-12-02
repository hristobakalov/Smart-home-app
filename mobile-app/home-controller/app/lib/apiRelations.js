import Settings from '../config/settings';


var baseUrl = Settings.baseUrl + 'api/';
var	relationsApiUrl = baseUrl + 'relations/user/';
var getAllUrl = baseUrl + 'userrolerelations/';
var sensorRoleUrl = baseUrl + 'relations/role/';

var apiRelations = {
	getAllUserRoleRelations(token, username){
		return fetch(getAllUrl, {
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
	getRoleByUserId(id, token, username){
		return fetch(relationsApiUrl + id + '/role', {
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
	// getByName(name){
		// return fetch(relationsApiUrl + name, {
			// method: "GET",
			// headers: {
				// 'Accept': 'application/json',
				// 'Content-Type': 'application/json'
			// },})
		// .then((response) => response.json());
	// },
	addUserRole(relation, token, username){
		return fetch(relationsApiUrl + 'role', {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username,
			},
			body: JSON.stringify(relation)})
		.then((response) => response.json());
	},
	updateRoleByRelationId(id, userRole, token, username){
		var url = relationsApiUrl  + id + '/role';
		return fetch(url, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			},
			body: JSON.stringify(userRole)})
		.then((response) => response.json());
	},
	
	getSensorsByRoleId(id, token, username){
		return fetch(sensorRoleUrl + id + '/sensor', {
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
	
	setSensorsToRoleId(id, sensors, token, username){
		var url = sensorRoleUrl  + id + '/sensor';
		return fetch(url, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-key': username
			},
			body: JSON.stringify(sensors)})
		.then((response) => response.json());
	},
	
};

module.exports = apiRelations;