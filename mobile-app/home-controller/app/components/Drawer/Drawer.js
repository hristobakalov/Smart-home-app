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
} 
from 'react-native'
import Settings from '../../config/roles';
import SensorApi from '../../lib/apiSensor';
import {StackNavigator} from 'react-navigation';

export default class SensorList extends Component {
	static navigationOptions= {
		title: 'Menu',
	};
	constructor (props){
		super(props);
		this.state = {
			userData: {},
			isAdministrator: false,
		};
	}
	componentWillMount(){
		console.log('I am loading the drawer!');
		var init = this._loadInitialState().done(() => {
			var loginData = this.state.userData;
			console.log('IsLoggedIn user an Administrator:' ,  loginData.user.Role == Settings.Administrator);
				  
			this.setState({isAdministrator: loginData.user.Role == Settings.Administrator});
		});
		
	}
	logout = () => {
		console.log('logout');
		AsyncStorage.removeItem('loginData');
		
		this.props.navigation.navigate('Home');
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
	}
	
	render() {
		const {navigate} = this.props.navigation;
	   return (
		  <View style = {styles.container}>
			<Text style = {styles.title}>MENU</Text>
			
			<TouchableOpacity
				style = {styles.row}
				onPress={()=> navigate('Sensors')}
			>
				<Text style = {styles.menuOption}>Sensors</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style = {styles.row}
				onPress={()=> navigate('Users')}
			>
				<Text style = {styles.menuOption}>Users</Text>
			</TouchableOpacity>
			
			<TouchableOpacity
				style = {styles.row}
				onPress={()=> navigate('EditSensors')}
			>
				<Text style = {styles.menuOption}>Edit Sensors</Text>
			</TouchableOpacity>
			
			<TouchableOpacity
				style = {this.state.isAdministrator? styles.row : styles.rowHidden}
				onPress={()=> navigate('AddUser')}
			>
				<Text style = {styles.menuOption}>Add User</Text>
			</TouchableOpacity>
			
			<TouchableOpacity
				style = {this.state.isAdministrator? styles.row : styles.rowHidden}
				onPress={()=> navigate('AddSensor')}
			>
				<Text style = {styles.menuOption}>Add Sensor</Text>
			</TouchableOpacity>
			
			<TouchableOpacity
				style={styles.buttonContainer}
				onPress={this.logout}
			>
				<Text style={styles.buttonText}>LOGOUT</Text>
			</TouchableOpacity>
			
		  </View>
	   )
	}
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 10,
	  
   },
   row:{
	   flexDirection: 'row',
	   marginBottom: 20
   },
   rowHidden: {
	   display: 'none'
   },
   button:{
	   marginBottom: 20,
	   color: "#3498db"
   },
   menuOption:{
	   fontWeight: '500',
	   fontSize:20
   },
   title:{
	   fontWeight: '700',
	   fontSize: 22,
	   color: "#3498db",
	   marginBottom: 30
   },
   buttonContainer: {
	   position: 'absolute',
	   bottom: 0,
		backgroundColor: '#2980b9',
		paddingVertical: 15,
		width: '100%'
	},
	buttonText: {
		textAlign: 'center',
		color: '#FFF',
		fontWeight: '700'
	},
})