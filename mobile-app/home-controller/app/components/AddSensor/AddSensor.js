import React, { Component } from 'react'
import {
   View,
   Text,
   Switch,
   StyleSheet,
   AsyncStorage,
   TouchableOpacity,
   Image,
   KeyboardAvoidingView,
   TextInput,
   StatusBar,
   Picker,
} 
from 'react-native'

import SensorApi from '../../lib/apiSensor';
import RelationApi from '../../lib/apiRelations';
import {StackNavigator} from 'react-navigation'

export default class AddSensor extends Component {
	static navigationOptions= {
		title: 'Add Sensor',
	};
	constructor (props){
		super(props);
		this.state = {
			sensor: {},
			userData: {},
			isOutputArr: ['LED','Water Pump'],
			allFieldsHaveValue: true,
			selectedValue: "",
			isPlantSelected: false,
		};
	}
	
	saveSensor = () => {
		console.log("Saving Sensor");
		var sensor = this.state.sensor;
		console.log(sensor);
		if(!sensor || sensor.Name == undefined || sensor.PinNumber == undefined || 
		sensor.Type == undefined)
		{
			this.state.allFieldsHaveValue = false;
			this.forceUpdate();
			return;
		}
		console.log(sensor);
		sensor.IsEnabled = false;
		sensor.PinNameNumber = sensor.PinNumber;
		sensor.Duration = 0;
		sensor.WateringTime = new Date();
		var userData = this.state.userData;
		
		SensorApi.add(sensor, userData.token, userData.user.Email)
		.then((res, err) => {
			if(err || res.status == 401){
				 alert(err);
				 return;
			 }
			 if(res._id){
				//sensor create successfully
				this.props.navigation.navigate('Sensors');
			 }
			 else{
				 console.log('kor kapan: Sensor was not created successfully');
			 }
			 
		});
	}
	
	isEmpty = (obj) => {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}
	componentWillMount(){
		var test = this._loadInitialState().done(()=>{
			var userData = this.state.userData;
			
		});
	}
	
	focusNextField(nextField) {
		this.refs[nextField].focus();
	}
	
	_loadInitialState = async() =>{
		try {
		   let value = await AsyncStorage.getItem('loginData');
		   if (value != null){
			  var loginData = JSON.parse(value);
			  this.setState({userData: loginData});
		   }
		   else {
			  console.log("Users: something smells here");
		  }
		} catch (error) {
		  console.log("Users: something blew up");
		}
		 // let value = await AsyncStorage.getItem('loginData', (err, result)=>{
			// console.log(result);
			// console.log(err);
			// });
		
	}
	updateName(value){
		if(!value){
			//alert("Last Name cannot be empty!");
			return;
		}
		const sensor = this.state.sensor;
		sensor.Name = value;
		// re-render
		this.forceUpdate();
	}
	updatePinNumber(value){
		if(!value){
			//alert("Password cannot be empty!");
			return;
		}
		const sensor = this.state.sensor;
		sensor.PinNumber = value;
		// re-render
		this.forceUpdate();
	}
	updateType(value){
		if(value === null || value === 0){
			return;
		}
		console.log(value);
		if(value == "plant"){
			this.state.isPlantSelected = true;
		}
		else{
			this.state.isPlantSelected = false;
		}
		
		const sensor = this.state.sensor;
		sensor.Type = value;
		// re-render
		this.setState({selectedValue: value});
		this.forceUpdate();
	}
	setPlantIP(value){
		if(value === null || value === 0){
			return;
		}
		const sensor = this.state.sensor;
		
		sensor.Ip = value;
		// re-render
		this.forceUpdate();
	}
	
	render() {
	   return (
		  <KeyboardAvoidingView behavior="padding" style={styles.container}>
				<StatusBar
					barStyle="light-content"
				/>
				<TextInput
					ref="1"
					style={styles.input}
					placeholder= "Name"
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					underlineColorAndroid = 'transparent'
					onSubmitEditing={() => this.focusNextField('2')}
					onChangeText={ (value) => this.updateName(value)}
				/>
				<TextInput
					ref="2"
					style={styles.input}
					placeholder= "Pin Number"
					underlineColorAndroid = 'transparent'
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					onChangeText={ (value) => this.updatePinNumber(value)}
				/>
				<Picker
					style={styles.input}
					mode="dropdown"
					selectedValue = {this.state.selectedValue}
					onValueChange={(value) => this.updateType(value)}>
					<Picker.Item label={"Select sensor type"} value={0} key={0} style={styles.picker}/>
					<Picker.Item label={"LED"} value={"led"} key={1} style={styles.picker}/>
					<Picker.Item label={"Plant"} value={"plant"} key={2} style={styles.picker}/>
                </Picker>
				<TextInput
					ref="3"
					style={this.state.isPlantSelected ? styles.input : styles.errorTextHidden}
					placeholder= "Plant IP"
					underlineColorAndroid = 'transparent'
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					onChangeText={ (value) => this.setPlantIP(value)}
				/>
				<Text style= {this.state.allFieldsHaveValue ? styles.errorTextHidden : styles.errorText}>All fields should be filled!</Text>
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={this.saveSensor}
				>
					<Text style={styles.buttonText}>Create Sensor</Text>
				</TouchableOpacity>
		  </KeyboardAvoidingView>
	   )
	}
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      marginTop: 50,
	  padding: 20
   },
   row:{
	   flexDirection: 'row',
	   marginBottom: 10,
	   
   },
   pensil:{
	   marginTop:5,
	   marginLeft: 20,
	   alignItems: 'flex-end',
	   width:20,
	   height:20
   },
   text:{
		paddingBottom : 5,
		fontSize: 22
   },
   textBold:{
	   paddingBottom : 5,
		fontSize: 22,
		fontWeight: '700'
   },
   buttonPress:{
	   flexDirection: 'row',
	   marginBottom: 10,
	   borderBottomWidth: 2,
	   borderColor: '#3498db'
   },
   input: {
		height: 40,
		backgroundColor: 'rgba(52,152,219,0.2)',
		marginBottom: 10,
		color: '#000',
		paddingHorizontal: 10
	},
	buttonContainer: {
		backgroundColor: '#2980b9',
		paddingVertical: 15
	},
	buttonText: {
		textAlign: 'center',
		color: '#FFF',
		fontWeight: '700'
	},
	errorText: {
		color: '#fc0202',
		marginBottom: 10
	},
	errorTextHidden: {
		display: 'none'
	},
	picker:{
		padding: 10,
		textDecorationLine:'underline'
	},
})