import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	Switch,
	FlatList
	} from 'react-native';
import SensorSwitch from './components/SensorSwitch/SensorSwitch'
import SensorList from './components/SensorList/SensorList'
import UserApi from './lib/apiUser';
import SensorApi from './lib/apiSensor';
export default class App extends React.Component {
	constructor (props){
		super(props);
		this.ws = null;
		this.state = {
			isConnected:false,
			switch1Value: false,
			switch2Value: false,
			switch3Value: false,
			users: [],
			new_data: {},
			sensors: []
		};
	}
	
	 toggleSwitch1 = (value) => {
		this.setState({switch1Value: value})
		this.send({isLedOn1: value})
		console.log('Switch 1 is: ' + value)
	}
   toggleSwitch2 = (value) => {
		this.setState({switch2Value: value})
		this.send({isLedOn2: value})
		console.log('Switch 2 is: ' + value)
	}	
    toggleSwitch3 = (value) => {
		this.setState({switch3Value: value})
		this.send({isLedOn3: value})
		console.log('Switch 3 is: ' + value)
	}
	switchSensor = (sensor) => {
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
		console.log(sensor._id);
		SensorApi.update(sensor._id, sensor);
		for(var i = 0; i < sensorsNew.length; i++ ){
			if(sensorsNew[i]._id == sensor._id){
				sensorsNew[i] = sensor;
			}
		}
		this.setState({sensors: sensorsNew});
	}
	componentWillMount(){
		// this.ws = new WebSocket ('ws://192.168.0.105:3001');
		// this.ws.onopen = () => {
			// console.warn('connected');
		// };
		
		// this.ws.onerror = (error) => {
			// console.warn(JSON.stringify(error));
		// }
		UserApi.getAll().then((res) => {
			this.setState({users: JSON.stringify(res)})
		});
		SensorApi.getAll().then((res) => {
			this.setState({sensors: res})
		});
		let new_data = this.state.users;
	}
	
	send (props){
		this.ws.send(JSON.stringify(props));
	}
  render() {
	  const {elements} = this.state;
    return (
	
		<View style={styles.container}>
			
			<SensorList
				items = {elements}
				sensors = {this.state.sensors}
				switchSensor = {this.switchSensor}
			/>
			
		 
	  </View>
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