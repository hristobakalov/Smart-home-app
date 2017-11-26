import React, { Component } from 'react'
import {
   View,
   Text,
   Switch,
   StyleSheet,
   Image,
   KeyboardAvoidingView,
   TextInput,
   TouchableOpacity,
   StatusBar,
   AsyncStorage
}
from 'react-native'

import {StackNavigator} from 'react-navigation'
import Settings from '../../config/settings';
export default class Login extends Component {
	static navigationOptions= {
		title: 'Login',
	};
	
	constructor(props){
		super(props);
		this.state ={
			username:'',
			password:'',
		};
	}
	componentDidMount(){
		this._loadInitialState().done();
	}
	
	_loadInitialState = async() =>{
		var value = await AsyncStorage.getItem('loginData');
		var valueObj = JSON.parse(value);
		if(valueObj !== null && valueObj.expires > Date.now()){
			this.props.navigation.navigate('Sensors');
		}
	}
	focusNextField(nextField) {
		this.refs[nextField].focus();
	}
	login = () => {
		fetch(Settings.baseUrl + 'login',{
			method: 'POST',
			headers:{
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
			})
		})
		.then((response) => response.json())
		.then((res) => {
			if(!res.message){
				AsyncStorage.setItem('loginData', JSON.stringify(res.loginData));
				this.props.navigation.navigate('Sensors');
			}
			else{
				alert(res.message);
			}
		})
		.done();
	}
	
	render() {
		const {navigate} = this.props.navigation;
		return (
			<KeyboardAvoidingView behavior="padding" style={styles.container}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						source={require('../../images/logo.png')}
					/>
					<Text style={styles.title}>Smart home application</Text>
				</View>
				<View style={styles.containerLogin}>
					<StatusBar
						barStyle="light-content"
					/>
					<TextInput
						ref="1"
						style={styles.input}
						placeholder= "username or email"
						placeholderTextColor="rgba(255,255,255,0.7)"
						returnKeyType="next"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						underlineColorAndroid = 'transparent'
						onSubmitEditing={() => this.focusNextField('2')}
						onChangeText={ (username) => this.setState({username})}
					/>
					<TextInput
						ref="2"
						style={styles.input}
						placeholder= "password"
						secureTextEntry
						autoCapitalize="none"
						underlineColorAndroid = 'transparent'
						placeholderTextColor="rgba(255,255,255,0.7)"
						returnKeyType="done"
						onChangeText={ (password) => this.setState({password})}
					/>
					<TouchableOpacity
						style={styles.buttonContainer}
						onPress={this.login}
					>
						<Text style={styles.buttonText}>LOGIN</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		);
	}
	
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#3498db'
	},
	logoContainer: {
		alignItems: 'center',
		flexGrow: 1,
		justifyContent: 'center'
	},
	logo: {
		width: 100,
		height: 120
	},
	title:{
		color: '#FFF',
		marginTop: 10,
		textAlign: 'center',
		opacity: 0.9
	},
	containerLogin: {
		padding: 20
	},
	input: {
		height: 40,
		backgroundColor: 'rgba(255,255,255,0.2)',
		marginBottom: 10,
		color: '#FFF',
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
});