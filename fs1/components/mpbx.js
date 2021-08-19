import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, Image, Button } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoiaGhlcnJlciIsImEiOiJja3J6OXg2eG8wNG5tMm9xbWsyN2x5dnB4In0.SrcL1Od2MgZnFr1z4unrqg');

const App = () => {

  const [coordinates] = useState([-122.3060, 47.66434]);

  return (
    <View style={styles.page}>
       <View style={styles.container}>
         <MapboxGL.MapView style={styles.map} styleURL="mapbox://styles/hherrer/ckse110wd90fr17qt8yd5ytjz">
           <MapboxGL.Camera
             zoomLevel={11}
             centerCoordinate={coordinates}
           />
           <MapboxGL.PointAnnotation coordinate={coordinates} />
         </MapboxGL.MapView>
       </View>
       <View>
        <View >
          <Button title='Connect'  />
        </View>
        <Text >FF1 - <Text>Latitude </Text> <Text>Longitude </Text></Text>
        <Text >FF2 - <Text>Latitude </Text> <Text>Longitude </Text></Text>
      </View>
     </View>
   );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
  height: '88%',
    width: '88%',
    backgroundColor: 'white',
  },
  map: {
    flex: 1
  }
});

export default App;