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
import RelationApi from '../../lib/apiRelations';
import {StackNavigator} from 'react-navigation'

export default class SensorList extends Component {
	
	static navigationOptions= {
		title: 'Sensors',
	};
	constructor (props){
		super(props);
		this.state = {
			sensors: [],
			shouldRefresh: false,
			userData: {}
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
			  if(loginData.user.Role == "Administrator"){
				  return;
			  }
			  RelationApi.getSensorsByRoleId(loginData.user.Role , loginData.token, loginData.user.Email).then((res) => {
					console.log(res);
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
	   return (
		  <View style = {styles.container}>
			<FlatList 
				data = {this.state.sensors}
				extraData ={this.state.shouldRefresh}
				keyExtractor={(item) => item._id}
				renderItem ={({item}) =>
					<View style = {styles.row}>
						<Text style={{fontSize: 22}}>{item.Name}
						</Text>
						<Switch
							onValueChange = {() => this.switchSensor(item)}
							value = {item.IsEnabled}
							style= {styles.switch}
						/>
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
   }
})
