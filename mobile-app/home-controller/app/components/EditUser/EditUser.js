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
			pressStatus: false,
			roles: [],
			selectedRole:{},
			userRoleRelation: {}
		};
	}
	
	saveUser = () => {
		console.log("Saving User");
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
			AsyncStorage.setItem('loginData', JSON.stringify(userData));
		}
		this.props.navigation.navigate('Users');
	}
	componentWillMount(){
		this.setState({user: this.props.navigation.state.params.user});
		var test = this._loadInitialState().done(()=>{
			var userData = this.state.userData;
			
			RoleApi.getAll(userData.token, userData.user.Email)
			.then((res,err) => {
				if(err){
					console.log(err);
				}
				
				this.setState({roles: res});
			});
			
			RelationApi.getAllUserRoleRelations(userData.token, userData.user.Email)
			.then((res,err) => {
				if(err){
					console.log(err);
				}
				var user = this.state.user;
				var relation = res.filter((item) => {
					return item.UserId==user._id;
				});
				this.setState({userRoleRelation: relation});
						
			});
			
			RelationApi.getRoleByUserId(this.state.user._id, userData.token, userData.user.Email)
			.then((res,err) => {
				if(err){
					console.log(err);
				}
				
				this.setState({selectedRole: res});
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
	updateRole(value){
		this.setState({selectedRole: value});
		
		var userData = this.state.userData;
		var relation = this.state.userRoleRelation;
		if(relation[0]){
			relation[0].RoleId = value._id;
			console.log(relation[0]);
			RelationApi.updateRoleByRelationId(relation[0]._id, relation[0], userData.token, userData.user.Email)
			.then((res,err) => {
				if(err){
					console.log(err);
					return;
				}
				
				this.setState({userRoleRelation: res});
				console.log(res);
			});
		}
		else{
			//create new relation
		}
		
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
					returnKeyType="next"
					onChangeText={ (value) => this.updateLastName(value)}
				/>
				<Picker
					style={styles.input}
					mode="dropdown"
					selectedValue = {this.state.selectedRole}
					onValueChange={(value) => this.updateRole(value)}>
					{this.state.roles.map((item, index) => {
						return (<Picker.Item label={item.Name} value={item} key={index} style={styles.picker}/>) 
                    })}
                </Picker>
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
	picker:{
		padding: 10,
		textDecorationLine:'underline'
	},
})