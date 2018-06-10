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
   ToastAndroid,
   RefreshControl,
   TextInput,
   KeyboardAvoidingView,
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
			sensorIdDateTime: "",
			dateTime: new Date(),
			temperature: "",
			soilMoisture: "",
			humidity: "",
			isDataLoaded: true,
			isRefreshing: false,
			showPlantOptions: false,
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
		
		this.getTemperature();
		
		//this.getSoilMoisture();
		 // let value = await AsyncStorage.getItem('loginData', (err, result)=>{
			// console.log(result);
			// console.log(err);
			// });
		
		
	}
	waterPlant = (sensor) => {
		console.log("water plant");
		var userData = this.state.userData;
		//alert("Plant is watered now!");
		ToastAndroid.show('Plant is being watered!', ToastAndroid.SHORT);
		try{
			SensorApi.waterPlant(sensor, userData.token, userData.user.Email).then((res) => {
				console.log(res);
			});
		}
		catch(err){
			console.log(err);
		}
		
		
	}
	getTemperature = (sensorId) => {
		this.setState({isDataLoaded: false});
		console.log("get plant data");
		var id = '';
		if(!sensorId){ // move this to intial setup
			id = '5b01970cdf675f03b068b828';
		}
		else{
			var id = sensorId;
		}
		
		var userData = this.state.userData;
		//alert("Plant is watered now!");
		ToastAndroid.show('Fetching plant data', ToastAndroid.SHORT);
		try{
			SensorApi.getTemperature(id, userData.token, userData.user.Email).then((res) => {
				console.log(res);
				this.setState({temperature: res.Temperature.substring(0,2)});
				this.setState({humidity: res.Humidity.substring(0,2)});
				SensorApi.getSoilMoisture(id, userData.token, userData.user.Email).then((res) => {
					console.log(res);
					var min = 150;
					var max = 700;
					var value = parseInt(res.Moisture);
					if(value < 150) value = 150;
					if(value > 700) value = 700;
					var percentage = ((value - min) * 100) / (max - min);
					var percentage = Math.round(percentage);
					this.setState({soilMoisture: percentage});
					this.setState({isDataLoaded: true});
					this.setState({isRefreshing: false});
					this.forceUpdate();
				});
			});
		}
		catch(err){
			console.log(err);
			this.setState({isDataLoaded: true});
			this.setState({isRefreshing: false});
			ToastAndroid.show('There is an error with fetching data', ToastAndroid.SHORT);
		}
	}

	saveSelectedDays(values, sensor){
		console.log('Selecte Days: ', values);
		console.log('id: ', sensor);
		sensor.WateringDays = values;
		SensorApi.update(sensor._id, sensor, this.state.userData.token, this.state.userData.user.Email);
	}
	
	//_showDateTimePicker = (id) => this.setState({ isDateTimePickerVisible: true, sensorIdDateTime: id });
	_showDateTimePicker(sensor){
		this.setState({isDateTimePickerVisible: true});
		this.setState({sensorIdDateTime: sensor});
	}
	_hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
	 
	_handleDatePicked = (date) => {
		console.log('A date has been picked: ', date);
		console.log(this.state.sensorIdDateTime);
		
		var sensor = this.state.sensorIdDateTime;
		console.log('Locale date ', sensor.WateringTime);
		
		// var hourOffset = 4 ; //for some reason there is +4 hours offset;
		// var newDate = new Date(date);
		// newDate = date.setTime(date.getTime() - (hourOffset*60*60*1000));
		sensor.WateringTime = date;
		SensorApi.update(sensor._id, sensor, this.state.userData.token, this.state.userData.user.Email);
		this.setState({dateTime: date});
		
		this._hideDateTimePicker();
		this.forceUpdate();
	};
	isSelected (item,index) {
		var result = false;
		var result = item.WateringDays.find( day => day == index );
		return result;
	}
	updateDuration = (value, sensor) => {
		if(!value){
			value = 0;
		}
		// if(parseInt(value) < 0)
		// {
			// ToastAndroid.show('Duration value is invalid', ToastAndroid.SHORT);
			// return;
		// }
		console.log("Updating duration value to ", value);
		sensor.Duration = parseInt(value);
		if(value && sensor.Duration != NaN){
		SensorApi.update(sensor._id, sensor, this.state.userData.token, this.state.userData.user.Email);
		this.forceUpdate();
		}
	}
	_onRefresh() {
		this.setState({isDataLoaded: false});
		this.setState({isRefreshing: true});
		this._loadInitialState();
		this.getTemperature();
		
    }
	_onLongPressButton = (button) => {
		console.log(button);
		if(button == "clock")ToastAndroid.show('Select the time of watering', ToastAndroid.SHORT);
		else if(button == "temperature") ToastAndroid.show('Shows room temperature', ToastAndroid.SHORT);
		else if(button == "humidity") ToastAndroid.show('Shows room humidity', ToastAndroid.SHORT);
		else if(button == "soilMoisture") ToastAndroid.show('Shows plant soil moisture', ToastAndroid.SHORT);
		else if(button == "duration") ToastAndroid.show('Set duraton in seconds for watering plant', ToastAndroid.SHORT);
	}
	toggleOptionsHidden = () => {
		console.log('toggle plant options');
		var currentState = this.state.showPlantOptions;
		this.setState({showPlantOptions: !currentState});
	}
	render() {
		if(this.state.isDataLoaded === false){
			return (
				<View style = {styles.container}>
					<Image
						style= {{marginTop: 100, width:160, height:160}}
						source={require('../../images/loading.gif')}
					/>
				</View>
			)
		}
	   return (
			<KeyboardAvoidingView behavior="padding" style={styles.container}>
			
			<FlatList
				refreshControl={
				  <RefreshControl
					refreshing={this.state.isRefreshing}
					onRefresh={this._onRefresh.bind(this)}
				  />
				}
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
								onPress={() => {this.waterPlant(item)}}
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
						{item.Type == "plant" &&
							<TouchableOpacity
								activeOpacity={0.4}
								style = {styles.trashIcon}
								onPress={() => {this.toggleOptionsHidden()}}
								underlayColor ='#3498db'
							>
								<Image
									style={styles.trash}
									source={require('../../images/down2.png')}
								/>
							</TouchableOpacity>
						}
						
					</View>
					{item.Type == "plant" &&
						<View style={this.state.showPlantOptions ? {flex: 1, flexDirection: 'column',} : {display: 'none'}}>
							<CheckboxGroup
								callback={(selected) => { this.saveSelectedDays(selected, item) }}
								iconColor={"#18cc66"}
								iconSize={18}
								checkedIcon="ios-checkbox-outline"
								uncheckedIcon="ios-square-outline"
								checkboxes={this.state.days.map((day, index) => {
									var obj= {};
									obj.label = day;
									obj.value = index;
									obj.selected = this.isSelected(item,index);
									return obj;
								})}
								labelStyle={styles.checkboxLabel}
								rowStyle={styles.checkboxGroup}
								rowDirection={"row"}
							/>
							<View style={this.state.showPlantOptions ? {flex: 1, flexDirection: 'row',} : {display: 'none'}}>
							
								<TouchableOpacity onPress={() => {this._showDateTimePicker(item)}} style={{flex: 1, flexDirection: 'row', marginTop: 10}}
									onLongPress={() => {this._onLongPressButton("clock")}}>
									<Image
										style={styles.clockImage}
										source={require('../../images/clock.png')}
									/>
									
									<Text style={styles.input}>{new Date(item.WateringTime).toLocaleTimeString('en-US').split(' ')[0]}</Text>
									
								</TouchableOpacity>
								<TouchableOpacity
									style = {styles.plantData}
									onLongPress={() => {this._onLongPressButton("duration")}}>
									<Text style = {{marginTop: 15}}>
										Duration:
									</Text>
									<TextInput
										ref="1"
										style={styles.inputDuration}
										placeholder= "Seconds"
										value={item.Duration.toString()}
										placeholderTextColor="rgba(0,0,0,0.7)"
										returnKeyType="next"
										autoCorrect={false}
										keyboardType='numeric'
										
										onChangeText={ (value) =>{ this.updateDuration(value, item)}}
									/>
									<Text style = {{marginTop: 15}}>
										sec
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						
					}
					{item.Type == "plant" &&
						<View style={{flex: 1, flexDirection: 'row',}}>
							<TouchableOpacity
								style = {styles.plantData}
								onLongPress={() => {this._onLongPressButton("temperature")}}>
								<Image
									style={styles.clockImage}
									source={require('../../images/temperature.png')}
								/>
								<Text style={styles.input}>{this.state.temperature}°C</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style = {styles.plantData}
								onLongPress={() => {this._onLongPressButton("humidity")}}>
								<Image
									style={styles.clockImage}
									source={require('../../images/moisture2.png')}
								/>
								<Text style={styles.input}>{this.state.humidity}%</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style = {styles.plantData}
								onLongPress={() => {this._onLongPressButton("soilMoisture")}}>
								<Image
									style={styles.clockImage}
									source={require('../../images/plant-moisture.png')}
								/>
								<Text style={styles.input}>{this.state.soilMoisture}%</Text>
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
		  </KeyboardAvoidingView>
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
	inputDuration:{
		width: 40,
		marginLeft: 10,
		marginRight: 5,
		marginTop:10,
		height: 30,
		paddingLeft: 10,
		backgroundColor: 'rgba(52,152,219,0.2)',
	},
	clockImage:{
	   alignItems: 'flex-end',
	   width:40,
	   height:40,
	},
	plantData:{
		width: 110,
		marginRight:15,
		flexDirection: 'row',
		flex: 1
	},
})
