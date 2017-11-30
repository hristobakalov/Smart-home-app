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
   StatusBar
} 
from 'react-native'

import UserApi from '../../lib/apiUser';
import {StackNavigator} from 'react-navigation'

export default class EditUser extends Component {
	static navigationOptions= {
		title: 'Edit User',
	};
	constructor (props){
		super(props);
		this.state = {
			user: {},
			shouldRefresh: false,
			userData: {},
			pressStatus: false
		};
	}
	
	saveUser = () => {
		console.log("Saved User");
		console.log(this.state.user);
		var user = this.state.user;
		var userData = this.state.userData;
		//update(id, user, token, username
		 UserApi.update(user._id, user, userData.token, userData.user.Email).then((res, err) => {
			if(err){
				 alert(err);
				 return;
			 }
			 console.log(res);
			
			
		});
		if(user._id == userData.user._id){
			// var userObj = user.toObject();
			// userObj.Role = userData.user.Role;
			user['Role'] = userData.user.Role;
			userData.user = user;
			console.log(userData);
			AsyncStorage.setItem('loginData', JSON.stringify(userData));
		}
		this.props.navigation.navigate('Users');
	}
	componentWillMount(){
		this.setState({user: this.props.navigation.state.params.user});
		var test = this._loadInitialState().done();
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
	updateEmail(email){
		if(!email){
			alert("Email cannot be empty!");
			return;
		}
		const user = this.state.user;
		user.Email = email;
		// re-render
		this.forceUpdate();
	}
	updateFirstName(value){
		if(!value){
			alert("First Name cannot be empty!");
			return;
		}
		const user = this.state.user;
		user.FirstName = value;
		// re-render
		this.forceUpdate();
	}
	updateLastName(value){
		if(!value){
			alert("Last Name cannot be empty!");
			return;
		}
		const user = this.state.user;
		user.LastName = value;
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
					value= {this.state.user.Email}
					placeholder= "Email"
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					underlineColorAndroid = 'transparent'
					onSubmitEditing={() => this.focusNextField('2')}
					onChangeText={ (value) => this.updateEmail(value)}
				/>
				<TextInput
					ref="2"
					style={styles.input}
					value= {this.state.user.FirstName}
					placeholder= "First Name"
					underlineColorAndroid = 'transparent'
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					onSubmitEditing={() => this.focusNextField('3')}
					onChangeText={ (value) => this.updateFirstName(value)}
				/>
				<TextInput
					ref="3"
					style={styles.input}
					value= {this.state.user.LastName}
					placeholder= "Last Name"
					underlineColorAndroid = 'transparent'
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="done"
					onChangeText={ (value) => this.updateLastName(value)}
				/>
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={this.saveUser}
				>
					<Text style={styles.buttonText}>Save changes</Text>
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
})