import React, { Component } from 'react'
import {
   View,
   Text,
   Switch,
   StyleSheet,
   FlatList,
   AsyncStorage,
   Button
} 
from 'react-native'

import SensorApi from '../../lib/apiSensor';
import RoleApi from '../../lib/apiRole';
import RelationApi from '../../lib/apiRelations';
import {StackNavigator} from 'react-navigation';
import CheckboxGroup from 'react-native-checkbox-group'
import Settings from '../../config/roles';

export default class EditSensors extends Component {
	
	static navigationOptions= {
		title: 'Edit Sensors',
	};
	constructor (props){
		super(props);
		this.state = {
			sensors: [],
			roles: [],
			shouldRefresh: false,
			userData: {},
			relations: [],
		};
	}
	
	componentWillMount(){
		var test = this._loadInitialState().done();
	}
	
	_loadInitialState = async() =>{
		try {
		   let value = await AsyncStorage.getItem('loginData');
		   if (value != null){
			  var loginData = JSON.parse(value);
			  
			  this.setState({userData: loginData});
			
			SensorApi.getAll(loginData.token, loginData.user.Email).then((res) => {
				//console.log('SENSORS: ', res);
				this.setState({sensors: res})
			});
				RelationApi.getAllRoleSensorRelations(loginData.token, loginData.user.Email)
				.then((res) => {
					//console.log('RELATIONS: ', res);
					this.setState({relations: res})
				});
				RoleApi.getAll(loginData.token, loginData.user.Email)
				.then((res,err) => {
					if(err){
						console.log(err);
					}
					//console.log('ROLES: ', res);
					this.setState({roles: res});
				});
		   }
		   else {
			  console.log("something smells here");
		  }
		} catch (error) {
		  console.log("something blew up", error);
		}
		
		
		 // let value = await AsyncStorage.getItem('loginData', (err, result)=>{
			// console.log(result);
			// console.log(err);
			// });
			
			/* {this.state.roles.map((item, index) => {
						return (<Picker.Item label={item.Name} value={item} key={item} style={styles.picker}/>)
						
                    })} */
		
	}
	
	isSelected = (item, sensor) => {
		var result = false;
		
		this.state.relations.filter((relation)=> {
			if(relation.RoleId == item._id)
			{
				relation.SensorId.filter((sensorId)=> {
					if(sensorId == sensor._id){
						result = true;
					}
				});
				return false;
			}
			return false;
		});
		return result;
	}
	
	saveSelectedSensors(selected, roleId){
		var userData = this.state.userData;
		if(userData.user.Role != Settings.Administrator){
			return false;
		}
		relation = {};
		relation.RoleId = roleId;
		relation.SensorId = selected;
		RelationApi.setSensorsToRoleId(roleId,relation, userData.token, userData.user.Email)
		.then((res) => {
			console.log('relation saved! ', res);
		});
	}
	
	render() {
	   return (
		  <View style = {styles.container}>
			<FlatList 
				data = {this.state.roles}
				extraData ={this.state.shouldRefresh}
				keyExtractor={(item) => item._id}
				renderItem ={({item}) =>
					<View style = {styles.row}>
						<Text style={styles.rowText}>{item.Name}
						</Text>
						<CheckboxGroup
							  callback={(selected) => { this.saveSelectedSensors(selected, item._id) }}
							  iconColor={"#00a2dd"}
							  iconSize={25}
							  checkedIcon="ios-checkbox-outline"
							  uncheckedIcon="ios-square-outline"
							  checkboxes={this.state.sensors.map((sensor, index) => {
								  var obj= {};
								  obj.label = sensor.Name;
								  obj.value = sensor._id;
								  obj.selected = this.isSelected(item,sensor)
								  return obj;
							  })}
							  labelStyle={styles.checkboxLabel}
							  rowStyle={styles.checkboxGroup}
							  rowDirection={"column"}
						/>
					</View>
				}
			/>
			
			
		  </View>
	   )
	}
}

const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: 'flex-start',
	  marginLeft: 30,
      marginTop: 20,
	  
   },
   row:{
	   flexDirection: 'row',
	   marginBottom: 10,
	   flexWrap: 'wrap'
   },
   switch:{
	   alignItems: 'flex-end'
   },
   button:{
	   marginBottom: 20,
	   color: "#3498db"
   },
   rowText:{
	   fontSize: 22,
	   width: '100%'
   },
   checkboxGroup:{
	   marginLeft: 30,
	   flexDirection: 'row'
   },
   checkboxLabel:{
	   fontSize: 20,
	   marginLeft: 15,
	   marginTop:2,
	   justifyContent: 'center',
	   alignItems: 'center'
   },
})
