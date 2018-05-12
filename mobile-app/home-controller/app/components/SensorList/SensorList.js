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
   Image,
   TextInput,
} 
from 'react-native'

import SensorApi from '../../lib/apiSensor';
import RelationApi from '../../lib/apiRelations';
import {StackNavigator} from 'react-navigation';
import Settings from '../../config/roles';
import CheckboxGroup from 'react-native-checkbox-group';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
			isUserAdministrator: false,
			days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			isDateTimePickerVisible: false,
			sensorIdDateTime: ""
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
	waterPlant(){
		console.log("water plant");
	}
	saveSelectedDays(values, id){
		console.log('Selecte Days: ', values);
		console.log('id: ', id);
	}
	
	//_showDateTimePicker = (id) => this.setState({ isDateTimePickerVisible: true, sensorIdDateTime: id });
	_showDateTimePicker(id){
		this.setState({isDateTimePickerVisible: true});
		this.setState({sensorIdDateTime: id});
	}
	_hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
	 
	_handleDatePicked = (date) => {
		console.log('A date has been picked: ', date);
		console.log(this.state.sensorIdDateTime);
		this._hideDateTimePicker();
	};
	isSelected
	render() {
	console.log('Loading view: ',this.state.isUserAdministrator);
	   return (
		  <View style = {styles.container}>
			<FlatList 
				data = {this.state.sensors}
				extraData ={this.state.shouldRefresh}
				keyExtractor={(item) => item._id}
				renderItem ={({item}) =>
				<View>
					<View style = {styles.row}>
						<Image
								style={item.Type == "plant" ? styles.icon : styles.hidden}
								source={require('../../images/plant.png')}
						/>
						<Image
								style={item.Type == "led" || item.Type == undefined ? styles.icon : styles.hidden}
								source={require('../../images/light.png')}
						/>
						<Text style={item.Type == "plant" ? styles.plantText : styles.text}>{item.Name}
						</Text>
						{item.Type != "plant" &&
							<Switch
								onValueChange = {() => this.switchSensor(item)}
								value = {item.IsEnabled}
								style= {styles.switch}
							/>
						}
						{item.Type == "plant" &&
							<Button
								onPress={this.waterPlant}
								title="Water"
								color="#18cc66"
								accessibilityLabel="Water plant"
							/>
						}
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
					{item.Type == "plant" &&
						<View style={{flex: 1, flexDirection: 'column',}}>
							<CheckboxGroup
								callback={(selected) => { this.saveSelectedDays(selected, 5) }}
								iconColor={"#18cc66"}
								iconSize={18}
								checkedIcon="ios-checkbox-outline"
								uncheckedIcon="ios-square-outline"
								checkboxes={this.state.days.map((day, index) => {
									var obj= {};
									obj.label = day;
									obj.value = index;
									obj.selected = true;
									return obj;
								})}
								labelStyle={styles.checkboxLabel}
								rowStyle={styles.checkboxGroup}
								rowDirection={"row"}
							/>
							
							<TouchableOpacity onPress={() => {this._showDateTimePicker(item._id)}} style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
								<Image
									style={styles.clockImage}
									source={require('../../images/clock.png')}
								/>
								<Text style={styles.input}>00:00</Text>
							</TouchableOpacity>
						</View>
						
					}
				</View>
				}
			/>
			<DateTimePicker
			  isVisible={this.state.isDateTimePickerVisible}
			  onConfirm={this._handleDatePicked}
			  onCancel={this._hideDateTimePicker}
			  mode="time"
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
    checkboxGroup:{
	   marginLeft: 15,
	   flexDirection: 'row'
    },
    checkboxLabel:{
	   fontSize: 12,
	   marginLeft: -15,
	   marginRight: 10,
	   marginTop:24,
	   justifyContent: 'center',
	   alignItems: 'center',
	   color: 'black'
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
    icon:{
	   width:30,
	   height: 30,
	   marginRight: 15,
    },
    waterPlant:{
	   backgroundColor: "#18cc66"
    },
    text: {
	   fontSize: 22,
	   minWidth: 130
    },
    plantText: {
	   fontSize: 22,
	   minWidth: 115
    },
	input: {
		height: 40,
		
		marginBottom: 10,
		paddingTop: 5,
		color: '#000',
		paddingHorizontal: 10,
		width: 50,
		flex: 1,
		flexDirection: 'row',
	},
	clockImage:{
	   alignItems: 'flex-end',
	   width:40,
	   height:40,
	}
})
