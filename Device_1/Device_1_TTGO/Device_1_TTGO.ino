#include <TinyGPS++.h>
#include <axp20x.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <iostream>
#include <string>

bool deviceConnected = false;

char b[20];
char c[20];
String latitude;
String longitude;

BLECharacteristic *pCharacteristic;
BLECharacteristic *p2Characteristic;
BLECharacteristic *p3Characteristic;
BLECharacteristic *p4Characteristic;

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_LAT "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_LNG "762f1772-eda5-11eb-9a03-0242ac130003"

#define CHARACTERISTIC_UUID_LAT1 "4c9e7aca-f8a3-11eb-9a03-0242ac130003"
#define CHARACTERISTIC_UUID_LNG1 "546d26d4-f8a3-11eb-9a03-0242ac130003"

TinyGPSPlus gps;
HardwareSerial GPS(1);
AXP20X_Class axp;

double lat = 0.0, lng = 0.0, altitude = 0.0, kmph = 0.0;
int satellites = 0, i = 0;
bool notEnoughSatelites = false;


class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if (value.length() > 0) {
        Serial.println("*********");
        Serial.print("New value: ");
        for (int i = 0; i < value.length(); i++)
          Serial.print(value[i]);

        Serial.println();
        Serial.println("*********");
      }
    }
};

class ServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
 deviceConnected = true;
    };
 
    void onDisconnect(BLEServer* pServer) {
 deviceConnected = false;
    }
};

void setup()
{
  Serial.begin(9600);
  Wire.begin(21, 22);
  if (!axp.begin(Wire, AXP192_SLAVE_ADDRESS)) {
    Serial.println("AXP192 Begin PASS");
  } else {
    Serial.println("AXP192 Begin FAIL");
  }
  axp.setPowerOutPut(AXP192_LDO2, AXP202_ON);
  axp.setPowerOutPut(AXP192_LDO3, AXP202_ON);
  axp.setPowerOutPut(AXP192_DCDC2, AXP202_ON);
  axp.setPowerOutPut(AXP192_EXTEN, AXP202_ON);
  axp.setPowerOutPut(AXP192_DCDC1, AXP202_ON);
  
  GPS.begin(9600, SERIAL_8N1, 34, 12);   // 34-TX 12-RX
  Serial.print("Starting GPS, this might take a while (~ 5 min max)");

  BLEDevice::init("Firefighter 1");
  
  BLEServer *pServer = BLEDevice::createServer();

  pServer->setCallbacks(new ServerCallbacks()); 
  
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_LAT,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  p2Characteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_LNG,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  p3Characteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_LAT1,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  p4Characteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_LNG1,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setCallbacks(new MyCallbacks());
  p2Characteristic->setCallbacks(new MyCallbacks());
  p3Characteristic->setCallbacks(new MyCallbacks());
  p4Characteristic->setCallbacks(new MyCallbacks());
  pService->start();

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
  
}

void loop()
{
  
  unsigned long start = millis();
  
  lat = gps.location.lat();
  lng = gps.location.lng();
  satellites = gps.satellites.value();
  altitude = gps.altitude.kilometers();
  kmph = gps.speed.kmph();

  notEnoughSatelites = (lat == 0.0 || lng == 0.0 || altitude == 0 || kmph == 0);

  if (satellites != 0 && notEnoughSatelites){
    Serial.print("Satellites: ");
    Serial.println(satellites);
    Serial.print("Time      : ");
    Serial.print(gps.time.hour());
    Serial.print(":");
    Serial.print(gps.time.minute());
    Serial.print(":");
    Serial.println(gps.time.second());
    Serial.println("**********************");
  }
  else if (notEnoughSatelites){
    Serial.print(".");
    i++;
    if (i%30 == 0){
      Serial.println("");
    }
    if (i == 300){
      Serial.println("5 min has passsed... try getting outside, GPS is not syncing"); 
    }
  }
  else {

  Serial.print(lat, 5);
  Serial.println(lng, 5);

  if (Serial.available() > 0) {
  
  String msgFromNB = Serial.readString();
  
  longitude = msgFromNB.substring(0,10);
  latitude = msgFromNB.substring(10,18);

  
  //Serial.println(longitude);
  //Serial.println(latitude);

  }

    if (deviceConnected) {
    
    char txString[12];
    dtostrf(lat, 5, 5, txString); // float_val, min_width, digits_after_decimal, char_buffer 
    
    pCharacteristic->setValue(txString);
    pCharacteristic->notify();

    char txString2[12];
    dtostrf(lng, 5, 5, txString2); // float_val, min_width, digits_after_decimal, char_buffer 
    
    p2Characteristic->setValue(txString2);
    p2Characteristic->notify();


    p3Characteristic->setValue(longitude.c_str());
    p3Characteristic->notify();

    p4Characteristic->setValue(latitude.c_str());
    p4Characteristic->notify();

    
    }
  

  }

  do
  {
    while (GPS.available())
      gps.encode(GPS.read());
  } while (millis() - start < 1000);

  if (millis() > 5000 && gps.charsProcessed() < 10)
    Serial.println(F("No GPS data received: check wiring"));
}
