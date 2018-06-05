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
byte ip[] = { 192, 168, 0, 199 }; //{ 192, 168, 1, 199 }; //Manual setup only
byte gateway[] = { 10,4,35,1}; //{ 192, 168, 1, 1 }; //Manual setup only
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
  float temperature = DHT.temperature;
  float humidity = DHT.humidity;
 
  // Wait for an incomming connection
  EthernetClient client = server.available();
   if (client) {
      bool turnWaterPump = false;
      int seconds = 10; //default amount of time the pump will be turned on
      Serial.println("new client");
      String requestRoute = "";
      boolean currentLineIsBlank = true;
      while (client.connected()) {
        if (client.available()) {
          
          char c = client.read();
          Serial.write(c);
          requestRoute += c;
        
          if (c == '\n' && currentLineIsBlank) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: application/json;charset=utf-8");
            client.println("Server: Arduino");
            client.println("Connnection: close");
            client.println();

            //API routes for GET requests - great engineering here!
            if(requestRoute.indexOf("/getTemperature") > 0){
              Serial.print("This is getTemperature: Temp- ");
              Serial.print(temperature);
              Serial.print(" Humidity- ");
              Serial.print(humidity);
              Serial.println();
                client.print("{\"Temperature\":\"");
                client.print(temperature);
                client.print("\",\"Humidity\":\"");
                client.print(humidity);
                client.print("\"}");
            }
            else if(requestRoute.indexOf("/waterPlant") > 0){
              Serial.println("This is waterPlant");
              String expectedAttribute = "duration=";
              int indexOfDuration = requestRoute.indexOf(expectedAttribute);
              String valueStr = "";
              if(indexOfDuration > 0){
                indexOfDuration += expectedAttribute.length();
                while(requestRoute[indexOfDuration] != ' '){
                  valueStr += requestRoute[indexOfDuration];
                  indexOfDuration++;
                }
                seconds = valueStr.toInt();
               
              }
               Serial.print("Duration: ");
               Serial.print(seconds);
               Serial.println();
               turnWaterPump = true;
              
                client.print("{\"Duration\":\"");
                client.print(seconds);
                client.print("\"}");
            }
            else if(requestRoute.indexOf("/getSoilMoisture") > 0){
              Serial.println("This is soilMoisture - ");
              
              int soilMoisture = readSoil();
              Serial.print(soilMoisture);
              
              client.print("{\"Moisture\":\"");
              client.print(soilMoisture);
              client.print("\"}");
            }
            else{
              Serial.print("Error received: ");
              Serial.println(requestRoute);
              client.print("{\"error\":\"kur\"}");
              
            }
 
           
            client.println();
            break;
          }
  
        }
      }
      delay(1);
      client.stop();
      Serial.println("client disconnected");
      if(turnWaterPump){
         waterPlant(seconds);
      }
    }

 // getTemperature();
//  getHumidity();
 // readSoil();
  //Serial.println(readSoil());
 // waterPlant();
  delay(1000);
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
float getTemperature()
{
  int chk = DHT.read11(DHT11_PIN);
  Serial.print("Temperature = ");
  Serial.println(DHT.temperature);
  return DHT.temperature;
}
float getHumidity()
{
  int chk = DHT.read11(DHT11_PIN);
  Serial.print("Humidity = ");
  Serial.println(DHT.humidity);
  return DHT.humidity;
}
void waterPlant(int seconds)
{
  int miliseconds = seconds * 1000;
  Serial.println("Turning water pump on: ");
  digitalWrite(waterPumpPin, HIGH);//turn D8 "On"
  delay(miliseconds);//wait 10 milliseconds
  digitalWrite(waterPumpPin, LOW);//turn D8 "Off"
  Serial.println("Turning water pump off ");
}
