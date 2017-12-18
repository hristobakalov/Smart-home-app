import React, { Component } from 'react'
import {
   View,
   Text,
   Switch,
   StyleSheet,
   FlatList,
   AsyncStorage,
   TouchableOpacity,
   Image
} 
from 'react-native'

import UserApi from '../../lib/apiUser';
import {StackNavigator} from 'react-navigation'
import { NavigationActions } from 'react-navigation'
import Settings from '../../config/roles';

const backAction = NavigationActions.back({
		key: 'Sensors'
})

export default class UserList extends Component {
	
	
	static navigationOptions= {
		title: 'Users',
	};
	constructor (props){
		super(props);
		this.state = {
			users: [],
			shouldRefresh: false,
			userData: {},
			pressStatus: false,
			isUserAdministrator: false
		};
		this.props.navigation.dispatch(backAction);
	}
	// SwitchValue = (sensor) => {
		// sensor.IsEnabled = !sensor.IsEnabled;
	// }
	
	editUser = (user) => {
		console.log("edit user");
		
		this.props.navigation.navigate('EditUser', {user: user});
	}
	deleteUser = (user) => {
		console.log("Delete user");
		var userData = this.state.userData;
		UserApi.delete(user._id, userData.token, userData.user.Email);
		//might want to delete this user from the users array
		 this.setState({
			users: this.state.users.filter((item) => item._id != user._id)
		  });
		this.forceUpdate();
	}
	componentWillMount(){
		var test = this._loadInitialState().done();
		console.log(this.props.navigation.state.key);
	}
	
	_loadInitialState = async() =>{
		try {
		   let value = await AsyncStorage.getItem('loginData');
		   if (value != null){
			  var loginData = JSON.parse(value);
			  if(loginData.user.Role == Settings.Administrator){
				this.setState({isUserAdministrator: true});
			  }
			  this.setState({userData: loginData});
			  UserApi.getAll(loginData.token, loginData.user.Email).then((res) => {
				this.setState({users: res})
				});
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
	
	 _onHideUnderlay(){
		this.setState({ pressStatus: false });
		console.log("notpressed");
	  }
	  _onShowUnderlay(){
		this.setState({ pressStatus: true });
		console.log("pressed");
	  }
	
	render() {
	   return (
		  <View style = {styles.container}>
			<FlatList 
				data = {this.state.users}
				extraData ={this.state.shouldRefresh}
				keyExtractor={(item) => item._id}
				renderItem ={({item}) =>
					<TouchableOpacity
						activeOpacity={0.4}
						style = {this.state.pressStatus ? styles.buttonPress : styles.row}
						onPress={() => {this.editUser(item)}}
						
						underlayColor ='#3498db'
					>
						<Text style={this.state.userData.user._id == item._id ? styles.textBold : styles.text}>{item.FirstName} {item.LastName}
						</Text>
						<Image
							style={styles.pensil}
							source={require('../../images/pensil.png')}
						/>
						<TouchableOpacity
							activeOpacity={0.4}
							style = {this.state.isUserAdministrator && this.state.userData.user._id != item._id  ? styles.row : styles.hidden}
							onPress={() => {this.deleteUser(item)}}
							
							underlayColor ='#3498db'
						>
							<Image
								style={styles.trash}
								source={require('../../images/trash-can.png')}
							/>
						</TouchableOpacity>
					</TouchableOpacity>
				}
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
	   marginBottom: 10,
	   
   },
   pensil:{
	   marginTop:5,
	   marginLeft: 20,
	   alignItems: 'flex-end',
	   width:20,
	   height:20
   },
   trash:{
	   marginLeft: 10,
	   alignItems: 'flex-end',
	   width:30,
	   height:30
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
   hidden:{
		display: 'none'
   }
})