/*
  Web client

  This sketch connects to a website through a MKR NB 1500 board. Specifically,
  this example downloads the URL "http://example.org/" and
  prints it to the Serial monitor.

  Circuit:
   - MKR NB 1500 board
   - Antenna
   - SIM card with a data plan

  created 8 Mar 2012
  by Tom Igoe
*/

// libraries
#include <MKRNB.h>
#include <ArduinoMqttClient.h>

#include "arduino_secrets.h"
// Please enter your sensitive data in the Secret tab or arduino_secrets.h
// PIN Number
const char PINNUMBER[]     = SECRET_PINNUMBER;
char b[20];
String latitude;
String longitude;

// initialize the library instance
NBClient client;
GPRS gprs;
NB nbAccess;
MqttClient mqttClient(client);

const char broker[] = "broker.hivemq.com";
int        port     = 1883;
const char topic[]  = "arduino/test1144";

const long interval = 5000;
unsigned long previousMillis = 0;
int count = 0;

void setup() {
  // initialize serial communications and wait for port to open:
  Serial.begin(9600);
  Serial1.begin(9600);
//  while (!Serial) {
//    ; // wait for serial port to connect. Needed for native USB port only
//  }

  Serial.println("Starting Arduino NB Network.");
  // connection state
  boolean connected = false;

  // After starting the modem with NB.begin()
  // attach to the GPRS network with the APN, login and password
  while (!connected) {
    if ((nbAccess.begin(PINNUMBER) == NB_READY) &&
        (gprs.attachGPRS() == GPRS_READY)) {
      connected = true;
      Serial.println("You're connected to the network");
    } else {
      Serial.println("Not connected");
      delay(1000);
    }
  }

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

    if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

  // subscribe to a topic
  mqttClient.subscribe(topic);

  // topics can be unsubscribed using:
  // mqttClient.unsubscribe(topic);

  //Serial.print("Waiting for messages on topic: ");
  //Serial.println(topic);
  //Serial.println();

}

void loop() {

  // call poll() regularly to allow the library to send MQTT keep alives which
  // avoids being disconnected by the broker
  mqttClient.poll();

  // avoid having delays in loop, we'll use the strategy from BlinkWithoutDelay
  // see: File -> Examples -> 02.Digital -> BlinkWithoutDelay for more info
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    // save the last time a message was sent
    previousMillis = currentMillis;

    Serial1.readBytes(b,18);
    String stringOne = b;
    longitude = stringOne.substring(0,10);
    latitude = stringOne.substring(10,18);

    Serial.print(longitude);
    Serial.println(latitude);

    // send message, the Print interface can be used to set the message contents
    mqttClient.beginMessage("arduino/test1145");
    mqttClient.print(longitude + "" + latitude);
    //mqttClient.print("");
    mqttClient.endMessage();

    Serial.println();
  }

  int messageSize = mqttClient.parseMessage();
  
  if (messageSize) {
    // we received a message, print out the topic and contents
    //Serial.print("Received a message with topic '");
    //Serial.print(mqttClient.messageTopic());
    //Serial.print("', length ");
    //Serial.print(messageSize);
    //Serial.println(" bytes:");

    // use the Stream interface to print the contents
    while (mqttClient.available()) {
      //Serial.print((char)mqttClient.read());
      Serial1.print((char)mqttClient.read());
    }
    Serial.println();

    Serial.println();
  }
  
  
}
