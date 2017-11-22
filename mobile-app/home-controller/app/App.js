import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	Switch
	} from 'react-native';
import SensorSwitch from './components/SensorSwitch/SensorSwitch'
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
			new_data: {}
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
		
		let new_data = this.state.users;
	}
	
	send (props){
		this.ws.send(JSON.stringify(props));
	}
  render() {
	  //console.warn(this.state.new_data.Email)
	 //console.warn(this.state.users);
	 var sensor = {
		"name" : "LED Green",
		"state" : "0"
	};
	 SensorApi.switch(sensor).then((res) => {
			console.log(res);
		});
	 // console.warn(JSON.stringify(this.state.users[0].FirstName));
	 //<Text>{this.state.new_data[0]}</Text>
    return (
	
		<View style={styles.container}>
			
			
		  <View style={styles.container}>
			 <SensorSwitch
				   toggleSwitch1 = {this.toggleSwitch1}
				   toggleSwitch2 = {this.toggleSwitch2}
				   toggleSwitch3 = {this.toggleSwitch3}
				   switch1Value = {this.state.switch1Value}
				   switch2Value = {this.state.switch2Value}
				   switch3Value = {this.state.switch3Value}/>
		  </View>
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
