import React, { Component } from 'react'
import {
   View,
   Text,
   Switch,
   StyleSheet
} 
from 'react-native'

export default SwitchExample = (props) => {
   return (
      <View style = {styles.container}>
		 <Text>Hello from the other side!</Text>
		 
		 <Text>Led 1 is: {props.switch1Value ? 'On' : 'Off'}</Text>
         <Switch
            onValueChange = {props.toggleSwitch1}
            value = {props.switch1Value}/>
		<Text>Led 2 is: {props.switch2Value ? 'On' : 'Off'}</Text>
         <Switch
            onValueChange = {props.toggleSwitch2}
            value = {props.switch2Value}/>
		<Text>Led 3 is: {props.switch3Value ? 'On' : 'Off'}</Text>
		 <Switch
            onValueChange = {props.toggleSwitch3}
            value = {props.switch3Value}/>
      </View>
   )
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 100
   }
})