import React, { Component } from 'react'
import {
   View,
   Text,
   Switch,
   StyleSheet,
   FlatList,
   AsyncStorage,
   Button,
   TouchableOpacity,
   Image
} 
from 'react-native'

import SensorApi from '../../lib/apiSensor';
import RelationApi from '../../lib/apiRelations';
import {StackNavigator} from 'react-navigation';
import Settings from '../../config/roles';

export default class SensorList extends Component {
	
	static navigationOptions= {
		title: 'Sensors',
	};
	constructor (props){
		super(props);
		this.state = {
			sensors: [],
			shouldRefresh: false,
			userData: {},
			isUserAdministrator: false
		};
	}
	SwitchValue = (sensor) => {
		sensor.IsEnabled = !sensor.IsEnabled;
	}
	switchSensor = (sensor) => {
		
		this.setState({shouldRefresh: !this.state.shouldRefresh});
		sensor.IsEnabled = !sensor.IsEnabled;
		var state = sensor.IsEnabled ? "1" : "0";
		var sensorsNew = this.state.sensors;
		var sensorToSwitch = {
		"name" : sensor.Name,
		"state" : state
		};
		try{
			SensorApi.switch(sensorToSwitch, this.state.userData.token, this.state.userData.user.Email).then((res) => {
			//console.log(res);
		});
		SensorApi.update(sensor._id, sensor, this.state.userData.token, this.state.userData.user.Email);
		for(var i = 0; i < sensorsNew.length; i++ ){
			if(sensorsNew[i]._id == sensor._id){
				sensorsNew[i] = sensor;
			}
		}
		this.setState({sensors: sensorsNew});
		}
		catch(err){
			console.log(err);
		}
	}
	
	deleteSensor = (sensor) => {
		console.log("Delete sensor");
		var userData = this.state.userData;
		SensorApi.delete(sensor._id, userData.token, userData.user.Email);
		//might want to delete this user from the users array
		 this.setState({
			sensors: this.state.sensors.filter((item) => item._id != sensor._id)
		  });
		this.forceUpdate();
	}
	
	navigateToUserScreen = () => {
		this.props.navigation.navigate('Users');
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
			  if(loginData.user.Role == Settings.Administrator){
				  this.setState({isUserAdministrator: true});
				  console.log('Setting state!!!: ',this.state.isUserAdministrator);
				  // this.forceUpdate();
				  // this._animate();
			  }
			  RelationApi.getSensorsByRoleId(loginData.user.Role , loginData.token, loginData.user.Email).then((res) => {
					//console.log(res);
					this.setState({sensors: res})
				});
			  // SensorApi.getAll(loginData.token, loginData.user.Email).then((res) => {
				// this.setState({sensors: res})
				// });
		   }
		   else {
			  console.log("something smells here");
		  }
		} catch (error) {
		  console.log("something blew up");
		}
		
		
		 // let value = await AsyncStorage.getItem('loginData', (err, result)=>{
			// console.log(result);
			// console.log(err);
			// });
		
	}
	
	
	render() {
	console.log('Loading view: ',this.state.isUserAdministrator);
	   return (
		  <View style = {styles.container}>
			<FlatList 
				data = {this.state.sensors}
				extraData ={this.state.shouldRefresh}
				keyExtractor={(item) => item._id}
				renderItem ={({item}) =>
					<View style = {styles.row}>
						<Text style={styles.text}>{item.Name}
						</Text>
						<Switch
							onValueChange = {() => this.switchSensor(item)}
							value = {item.IsEnabled}
							style= {styles.switch}
						/>
						<TouchableOpacity
							activeOpacity={0.4}
							style = {this.state.isUserAdministrator ? styles.trashIcon : styles.hidden}
							onPress={() => {this.deleteSensor(item)}}
							
							underlayColor ='#3498db'
						>
							<Image
								style={styles.trash}
								source={require('../../images/trash-can.png')}
							/>
						</TouchableOpacity>
					</View>
				}
			/>
			
			<Button
				onPress={this.navigateToUserScreen}
				title="Go to user's list"
				style = {styles.button}
				accessibilityLabel="Go to User List View"
			/>
		  </View>
	   )
	}
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 50,
	  
   },
   row:{
	   flexDirection: 'row',
	   marginBottom: 20
   },
   switch:{
	   alignItems: 'flex-end'
   },
   button:{
	   marginBottom: 20,
	   color: "#3498db"
   },
    hidden:{
		display: 'none'
   },
   trashIcon: {
	   marginLeft: 20,
	   height: 30,
	   width:30
   },
   trash:{
	   // marginLeft: 10,
	   alignItems: 'flex-end',
	   width:30,
	   height:30
   },
   text: {
	   fontSize: 22,
	   minWidth: 130
   }
})
