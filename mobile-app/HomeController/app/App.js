import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	Switch
	} from 'react-native';
import SwitchExample from './SwitchExample'

export default class App extends React.Component {
	constructor (props){
		super(props);
		this.ws = null;
		this.state = {
			isConnected:false,
			switch1Value: false,
			switch2Value: false,
			switch3Value: false,
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
		this.ws = new WebSocket ('ws://192.168.0.105:8080');
		this.ws.onopen = () => {
			console.warn('connected');
		};
		
		this.ws.onerror = (error) => {
			console.warn(error);
		}
	}
	
	send (props){
		this.ws.send(JSON.stringify(props));
	}
  render() {
    return (
      <View style={styles.container}>
         <SwitchExample
               toggleSwitch1 = {this.toggleSwitch1}
               toggleSwitch2 = {this.toggleSwitch2}
			   toggleSwitch3 = {this.toggleSwitch3}
               switch1Value = {this.state.switch1Value}
               switch2Value = {this.state.switch2Value}
			   switch3Value = {this.state.switch3Value}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
