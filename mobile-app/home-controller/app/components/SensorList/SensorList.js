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
		<FlatList 
					data = {props.sensors}
					extraData ={props.shouldRefresh}
					keyExtractor={(item) => item._id}
					renderItem ={({item}) =>
					<View style = {styles.row}>
						<Text>{item.Name}
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
   },
   row:{
	   flexDirection: 'row',
	   marginBottom: 10
   }
})