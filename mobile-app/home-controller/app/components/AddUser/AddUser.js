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

import UserApi from '../../lib/apiUser';
import RoleApi from '../../lib/apiRole';
import RelationApi from '../../lib/apiRelations';
import {StackNavigator} from 'react-navigation'

export default class AddUser extends Component {
	static navigationOptions= {
		title: 'Add User',
	};
	constructor (props){
		super(props);
		this.state = {
			user: {},
			userData: {},
			roles: [],
			selectedRole:{},
			userRoleRelation: {},
			repeatPassword: "",
			matchingPasswords: true,
			allFieldsHaveValue: true
		};
	}
	
	saveUser = () => {
		console.log("Saving User");
		var user = this.state.user;
		var role = this.state.selectedRole;
		
		if(!user || user.Email == undefined || user.FirstName == undefined || user.LastName == undefined
			|| user.Password == undefined || !role || role.Name == undefined || this.state.repeatPassword != user.Password)
		{
			this.state.allFieldsHaveValue = false;
			this.forceUpdate();
			return;
		}
			
		var userData = this.state.userData;
		
		UserApi.add(user, userData.token, userData.user.Email)
		.then((res, err) => {
			if(err){
				 alert(err);
				 return;
			 }
			 if(res._id && role._id){
				 //create new relation
				 
				var relation = {
					UserId: res._id,
					RoleId: role._id
				}
				RelationApi.addUserRole(relation, userData.token, userData.user.Email)
				.then((res,err) => {
					if(err){
						console.log(err);
						return;
					}
					this.props.navigation.navigate('Users');
					console.log(res);
				});
			 }
			 else{
				 console.log('kor kapan: User or ROle id is empty');
			 }
			 
		});
		/* 
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
			AsyncStorage.setItem('loginData', JSON.stringify(userData));
		}
		this.props.navigation.navigate('Users');
		 */
		/*
		
			//create new relation
			var relation = {
				UserId: this.state.user._id,
				RoleId: value._id
			}
			RelationApi.addUserRole(relation, userData.token, userData.user.Email)
			.then((res,err) => {
				if(err){
					console.log(err);
					return;
				}
				
				this.setState({userRoleRelation: res});
				console.log(res);
			});
		
		*/
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
			
			RoleApi.getAll(userData.token, userData.user.Email)
				.then((res,err) => {
					if(err){
						console.log(err);
					}
					console.log(this.state.roles);
					if(this.isEmpty(this.state.roles)){
						this.setState({roles: res});
					}
				});
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
	updatePassword(value){
		if(!value){
			alert("Password cannot be empty!");
			return;
		}
		const user = this.state.user;
		user.Password = value;
		// re-render
		this.forceUpdate();
	}
	updateRepeatPassword(value){
		this.setState({repeatPassword: value});
		// re-render
		if(this.state.user.Password != value){
			this.state.matchingPasswords = false;
		}
		else{
			this.state.matchingPasswords = true;
		}
		this.forceUpdate();
	}
	updateRole(value){
		if(value == null || value == 0){
			return;
		}
		this.setState({selectedRole: value});
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
					placeholder= "Last Name"
					underlineColorAndroid = 'transparent'
					placeholderTextColor="rgba(0,0,0,0.7)"
					onSubmitEditing={() => this.focusNextField('4')}
					returnKeyType="next"
					onChangeText={ (value) => this.updateLastName(value)}
				/>
				<TextInput
					ref="4"
					style={styles.input}
					placeholder= "Password"
					underlineColorAndroid = 'transparent'
					secureTextEntry
					autoCapitalize="none"
					placeholderTextColor="rgba(0,0,0,0.7)"
					onSubmitEditing={() => this.focusNextField('5')}
					returnKeyType="next"
					onChangeText={ (value) => this.updatePassword(value)}
				/>
				<TextInput
					ref="5"
					style={styles.input}
					placeholder= "Repeat Password"
					underlineColorAndroid = 'transparent'
					secureTextEntry
					autoCapitalize="none"
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					onChangeText={ (value) => this.updateRepeatPassword(value)}
				/>
				<Text style= {this.state.matchingPasswords ? styles.errorTextHidden : styles.errorText}>Passwords should match!</Text>
				<Picker
					style={styles.input}
					mode="dropdown"
					selectedValue = {this.state.selectedRole}
					onValueChange={(value) => this.updateRole(value)}>
					<Picker.Item label={"Please select a role..."} value={0} key={0} style={styles.picker}/>
					{this.state.roles.map((item, index) => {
						return (<Picker.Item label={item.Name} value={item} key={item} style={styles.picker}/>)
						
                    })}
                </Picker>
				<Text style= {this.state.allFieldsHaveValue ? styles.errorTextHidden : styles.errorText}>All fields should be filled!</Text>
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={this.saveUser}
				>
					<Text style={styles.buttonText}>Create User</Text>
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