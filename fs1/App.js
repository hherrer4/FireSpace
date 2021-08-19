import "react-native-gesture-handler";
import React from "react";
import { Button, Text, View, StyleSheet, Image } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Blecnt from './components/blecnt';
import Dmap from "./components/mp";
import Mbox from "./components/mpbx";

const Stack = createStackNavigator();

function HomeScreen({navigation}){
  return(
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')}/>
      <Text style={styles.Title}>FireSpace</Text>
      <Button style={styles.btn} title="Connect device" onPress={() =>{
        navigation.navigate("DetailScreen");
        }}/>
      <Button title="Map" onPress={() =>{
        navigation.navigate("Map");
        }}/>
      <Button title="MapBox" onPress={() =>{
        navigation.navigate("MapBox");
        }}/>
    </View>
  );
}

function DetailScreen(){
  return(
    <View>
      <Blecnt />
    </View>
  );
}

function Map(){
  return(
    <View style={styles.container}>
      <Dmap />
    </View>
  );
}

function MapBox(){
  return(
    <View>
      <Mbox />
    </View>
  );
}

export default function App() {

  return(
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="DetailScreen" component={DetailScreen}/>
        <Stack.Screen name="Map" component={Map}/>
        <Stack.Screen name="MapBox" component={MapBox}/>
      </Stack.Navigator>
    </NavigationContainer> 
  )

}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  },

  Title:{
    fontSize:60,
    color: 'darkgrey',
    alignItems: 'center',
  },

  btn:{
    fontSize: 50,
  }

});