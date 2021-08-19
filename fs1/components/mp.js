 import React, {
    useState,
    useEffect,
    Component,
  } from 'react';
  import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Button,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    Dimensions,
    Alert,
  } from 'react-native';
  
  import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';
  
  import Buffer from "buffer";

  import MapView, { Callout, Marker } from 'react-native-maps';
  
  import BleManager from 'react-native-ble-manager';
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


 export default function Dmap() {

    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [lat1, setLat1] = useState(0);
    const [lng1, setLng1] = useState(0);
  

    const LONGITUDE = lng;
    const LATITUDE = lat;

    const LONGITUDE1 = lng1;
    const LATITUDE1 = lat1;
    

      const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
      }

      const handleDisconnectedPeripheral = (data) => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
          peripheral.connected = false;
          peripherals.set(peripheral.id, peripheral);
          setList(Array.from(peripherals.values()));
        }
        console.log('Disconnected from ' + data.peripheral);
      }

      const handleDiscoverPeripheral = (peripheral) => {
        console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
          peripheral.name = 'NO NAME';
        }
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }

      const handleUpdateValueForCharacteristic = (data) => {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
      }

      const retrieveConnected = () => {
        BleManager.getConnectedPeripherals([]).then((results) => {
          if (results.length == 0) {
            console.log('No connected peripherals')
          }
          console.log(results);
          for (var i = 0; i < results.length; i++) {
            var peripheral = results[i];
            peripheral.connected = true;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
          }
        });
      }

      const deviceConnection = () => {
        
        if (!isScanning) {
            BleManager.scan([], 3, true).then((results) => {
              console.log('Scanning...');
              setIsScanning(true);
            }).catch(err => {
              console.error(err);
            });
          }  

        BleManager.connect("B0D50CE6-CD39-9695-D9A2-E94DBA22F40C")
        .then(() => {
        // Success code
        console.log("Connected");

        setInterval(() => {
  
            /* Test read current RSSI value */
            BleManager.retrieveServices("B0D50CE6-CD39-9695-D9A2-E94DBA22F40C").then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);
            
              BleManager.read(
                "B0D50CE6-CD39-9695-D9A2-E94DBA22F40C",
                "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
                "BEB5483E-36E1-4688-B7F5-EA07361B26A8"
              )
                .then((readData) => {
                  // Success code
                  //console.log("Read: " + readData);
                  
                  const buffer = Buffer.Buffer.from(readData); 
                  const sensorData = buffer.readUInt8(1, true);
                  //const sensorData = buffer.readFloatLE(1, true);
                  
                  //const sensdata = bytesToString(readData);
                  const bytesString1 = String.fromCharCode(...readData);
                  const byteNumber1 = Number(bytesString1);
                  setLat(byteNumber1);

                  //console.log("Data: " + sensorData);
                  console.log("Data LAT device 1: " + bytesString1);
                })
                .catch((error) => {
                  // Failure code
                  console.log(error);
                });

                //"83EA1544-98D1-7936-35B0-49E095216095"

                BleManager.read(
                  "B0D50CE6-CD39-9695-D9A2-E94DBA22F40C",
                  "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
                  "762F1772-EDA5-11EB-9A03-0242AC130003"
                )
                  .then((readData) => {
                    // Success code
                    //console.log("Read: " + readData);
                    
                    const buffer = Buffer.Buffer.from(readData); 
                    const sensorData = buffer.readUInt8(1, true);
                    //const sensorData = buffer.readFloatLE(1, true);
                    
                    //const sensdata = bytesToString(readData);
                    const bytesString2 = String.fromCharCode(...readData);
                    const byteNumber2 = Number(bytesString2);
                    setLng(byteNumber2);
  
                    //console.log("Data: " + sensorData);
                    console.log("Data LNG device 1: " + byteNumber2);
                  })
                  .catch((error) => {
                    // Failure code
                    console.log(error);
                  });

                  BleManager.read(
                    "B0D50CE6-CD39-9695-D9A2-E94DBA22F40C",
                    "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
                    "4c9e7aca-f8a3-11eb-9a03-0242ac130003"
                  )
                    .then((readData) => {
                      // Success code
                      //console.log("Read: " + readData);
                      
                      //const buffer = Buffer.Buffer.from(readData);
                      //const sensorData = buffer.readUInt8(1, true); 
                      
                      //const sensdata = bytesToString(readData);
                      const bytesString3 = String.fromCharCode(...readData);
                      setLng1(bytesString3);
                      
    
                      //console.log("Data sens: " + sensorData);
                      console.log("Data LNG device 2: " + bytesString3);
                    })
                    .catch((error) => {
                      // Failure code
                      console.log(error);
                    });


                    BleManager.read(
                      "B0D50CE6-CD39-9695-D9A2-E94DBA22F40C",
                      "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
                      "546d26d4-f8a3-11eb-9a03-0242ac130003"
                    )
                      .then((readData) => {
                        // Success code
                        //console.log("Read: " + readData);
                        
                        //const buffer = Buffer.Buffer.from(readData); 
                        //const sensorData = buffer.readUInt8(1, true);
                        //const sensorData = buffer.readFloatLE(1, true);
                        
                        //const sensdata = bytesToString(readData);
                        const bytesString4 = String.fromCharCode(...readData);
                        setLat1(bytesString4);
      
                        //console.log("Data: " + sensorData);
                        console.log("Data LAT device 2: " + bytesString4);
                      })
                      .catch((error) => {
                        // Failure code
                        console.log(error);
                      });

            });

          }, 6000);


        })
        .catch((error) => {
        // Failure code
        console.log(error);
        });
            
          
      }

      useEffect(() => {
        BleManager.start({showAlert: false});
    
        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
    
        if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("Permission is OK");
              } else {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                  if (result) {
                    console.log("User accept");
                  } else {
                    console.log("User refuse");
                  }
                });
              }
          });
        }  
        
        return (() => {
          console.log('unmount');
          bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
          bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan );
          bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
          bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
        })
      }, []);


   return (

    <View style={styles.container}>
      <View>
        <MapView mapType="satellite" style={styles.map} initialRegion={{
        latitude: 47.66413,
        longitude: -122.30579,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }} 
        >
        <Marker 
         coordinate ={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          //latitude: 47.66413,
          //longitude: -122.30579,
        }}
         image={require('../assets/FF.png')}
        >
        <Callout>
          <Text>Firefighter 1</Text>
        </Callout>
 
        </Marker>

        <Marker 
         coordinate ={{
          latitude: LATITUDE1,
          longitude: LONGITUDE1,
          //latitude: 47.66413,
          //longitude: -122.30579,
        }}
        image={require('../assets/FF.png')}
        >
        <Callout>
          <Text>Firefighter 2</Text>
        </Callout>
 
        </Marker>

        </MapView>
      </View>

      <View>
        <View style={styles.buttonContainer}>
          <Button title='Connect' onPress={() => deviceConnection()} />
        </View>
        <Text style={styles.boldTxt}>FF1 - <Text>Latitude {lat}</Text> <Text>Longitude {lng}</Text></Text>
        <Text style={styles.boldTxt}>FF2 - <Text>Latitude {lat1}</Text> <Text>Longitude {lng1}</Text></Text>
      </View>
      
    </View>
     
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
   },
   map: {
     width: Dimensions.get('window').width,
     height: 500,
   },
   boldTxt: {
      fontWeight: 'bold',
      fontSize: 15,
      padding: 20,
   },
   txt: {
    padding: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connct: {
    backgroundColor: "grey",
    padding: 20,
  },

  buttonContainer: {
    marginTop: 20,
  },

 });