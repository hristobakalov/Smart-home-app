import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	Switch,
	FlatList,
	AsyncStorage
	} from 'react-native';
import SensorSwitch from './components/SensorSwitch/SensorSwitch'
import SensorList from './components/SensorList/SensorList'
import UserApi from './lib/apiUser';
import SensorApi from './lib/apiSensor';
import Login from './components/Login/Login'

import Expo from 'expo'
import {StackNavigator} from 'react-navigation'

const Navigation = StackNavigator({
	Home: {screen: Login},
	Sensors: {screen: SensorList},
	},{
		navigationOptions: {
			header: false,
			headerStyle: {
				backgroundColor: '#3498db',
				marginTop: Expo.Constants.statusBarHeight
			}
		}
});

export default class App extends React.Component {
	constructor (props){
		super(props);
		this.state = {
			isConnected:false,
			users: [],
			sensors: [],
			shouldRefresh: false
		};
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
		SensorApi.switch(sensorToSwitch).then((res) => {
			//console.log(res);
		});
		SensorApi.update(sensor._id, sensor);
		for(var i = 0; i < sensorsNew.length; i++ ){
			if(sensorsNew[i]._id == sensor._id){
				sensorsNew[i] = sensor;
			}
		}
		this.setState({sensors: sensorsNew});
	}
	componentWillMount(){
		UserApi.getAll().then((res) => {
			this.setState({users: JSON.stringify(res)})
		});
		SensorApi.getAll().then((res) => {
			this.setState({sensors: res})
		});
	}
	
  render() {
    return (
		<Navigation/>
		
		
    );
  }
}
const styles = StyleSheet.create({
  container: {
	marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
//<Login/>
//Working view for Sensors
// <View style={styles.container}>
			
			// <SensorList
				// sensors = {this.state.sensors}
				// switchSensor = {this.switchSensor}
				// shouldRefresh = {this.state.shouldRefresh}
			// />
			
		 
	  // </View> 
	  
	  
	  
	  
	  
	  //OLD CODE
 // <View style={styles.container}>
			 // <SensorSwitch
				   // toggleSwitch1 = {this.toggleSwitch1}
				   // toggleSwitch2 = {this.toggleSwitch2}
				   // toggleSwitch3 = {this.toggleSwitch3}
				   // switch1Value = {this.state.switch1Value}
				   // switch2Value = {this.state.switch2Value}
				   // switch3Value = {this.state.switch3Value}/>
		  // </View>
 //console.warn(this.state.new_data.Email)
	 // console.log("Sensors: ",this.state.sensors);
	 // var sensor = {
		// "name" : "LED Green",
		// "state" : "0"
	// };
	 // SensorApi.switch(sensor).then((res) => {
			// console.log(res);
		// });
	 // console.warn(JSON.stringify(this.state.users[0].FirstName));
	 //<Text>{this.state.new_data[0]}</Text>