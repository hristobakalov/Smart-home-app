#include <dht.h>
#include <WString.h>
#include <Ethernet.h>
#include <ArduinoJson.h>
#include <SPI.h>

dht DHT;

#define DHT11_PIN 6
int val = 0; //value for storing moisture value
int soilPin = A0;//Declare a variable for the soil moisture sensor
int soilPower = 7;//Variable for Soil moisture Power
int waterPumpPin = 8;//Variable for Water pump pin

EthernetServer server(80);
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
byte ip[] = { 192, 168, 1, 199 }; //Manual setup only
byte gateway[] = { 192, 168, 1, 1 }; //Manual setup only
byte subnet[] = { 255, 255, 255, 0 }; //Manual setup only

boolean reading = false;

void setup() {
  Serial.begin(9600);
  pinMode(soilPower, OUTPUT);//Set D7 as an OUTPUT
  digitalWrite(soilPower, LOW);//Set to LOW so no power is flowing through the sensor

  pinMode(waterPumpPin, OUTPUT);//Set D8 as an OUTPUT
  digitalWrite(waterPumpPin, LOW);//Set to LOW so no power is flowing through the sensor
  
  Ethernet.begin(mac, ip, gateway, subnet);
  // Initialize Ethernet libary
 // if (!Ethernet.begin(mac)) { //Ethernet.begin(mac, ip, gateway, subnet);for manual setup  ////Ethernet.begin(mac);
 //  Serial.println(F("Failed to initialize Ethernet library"));
 //  return;
// }

  // Start to listen
  server.begin();

  Serial.println(F("Server is ready."));
  Serial.print(F("Please connect to http://"));
  Serial.println(Ethernet.localIP());

}

void loop() {
  int chk = DHT.read11(DHT11_PIN);

  // Wait for an incomming connection
  EthernetClient client = server.available();

  // Do we have a client?
  if (!client) return;
  Serial.println(F("New client"));

  // Read the request (we ignore the content in this example)
  while (client.available()){
    client.read();
  }
  if(reading && c == ‘ ‘) reading = false;
  if(c == ‘?’) reading = true; //found the ?, begin reading the info
  // Allocate JsonBuffer
  // Use arduinojson.org/assistant to compute the capacity.
  StaticJsonBuffer<500> jsonBuffer;

  // Create the root object
  JsonObject& root = jsonBuffer.createObject();

  // Create the "analog" array
  JsonArray& analogValues = root.createNestedArray("analog");
  for (int pin = 0; pin < 6; pin++) {
    // Read the analog input
    int value = analogRead(pin);

    // Add the value at the end of the array
    analogValues.add(value);
  }

  // Create the "digital" array
  JsonArray& digitalValues = root.createNestedArray("digital");
  for (int pin = 0; pin < 14; pin++) {
    // Read the digital input
    int value = digitalRead(pin);

    // Add the value at the end of the array
    digitalValues.add(value);
  }

  Serial.print(F("Sending: "));
  root.printTo(Serial);
  Serial.println();

  // Write response headers
  client.println("HTTP/1.0 200 OK");
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.println();

  // Write JSON document
  root.prettyPrintTo(client);

  // Disconnect
  client.stop();

 // getTemperature();
//  getHumidity();
 // readSoil();
  //Serial.println(readSoil());
 // waterPlant();
 // delay(1000);
}

int readSoil()
{
  //get soil moisture value from the function below and print it
  digitalWrite(soilPower, HIGH);//turn D7 "On"
  delay(10);//wait 10 milliseconds
  val = analogRead(soilPin);//Read the SIG value form sensor
  digitalWrite(soilPower, LOW);//turn D7 "Off"

  Serial.print("Soil Moisture = ");
  Serial.println(val);
  return val;//send current moisture value
}
double getTemperature()
{
  Serial.print("Temperature = ");
  Serial.println(DHT.temperature);
  return DHT.temperature;
}
double getHumidity()
{
  Serial.print("Humidity = ");
  Serial.println(DHT.humidity);
  return DHT.humidity;
}
void waterPlant()
{
  Serial.println("Turning water pump on: ");
  digitalWrite(waterPumpPin, HIGH);//turn D8 "On"
  delay(10000);//wait 10 milliseconds
  digitalWrite(waterPumpPin, LOW);//turn D8 "Off"
  Serial.println("Turning water pump off ");
}
