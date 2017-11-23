import React, { Component } from 'react'
import {
   View,
   Text,
   Switch,
   StyleSheet,
   FlatList
} 
from 'react-native'

SwitchValue = (sensor) => {
	sensor.IsEnabled = !sensor.IsEnabled;
	console.log(sensor);
}

export default SensorList = (props) => {
   return (
      <View style = {styles.container}>
		<FlatList data = {props.sensors}
					keyExtractor={(x,i) => i}
					renderItem ={({item}) =>
					<View>
						<Text>{item.Name} - {item.IsEnabled == true ? 'On' : 'Off'}
						</Text>
						<Switch
							onValueChange = {() => props.switchSensor(item)}
							value = {item.IsEnabled}
						/>
					</View>
				}
		/>
      </View>
   )
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 50
   }
})