function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("DBUrl", 'mongodb://localhost/db');
define("ArduinoGetTemperatureRoute", '/getTemperature');
define("ArduinoGetSoilMoistureRoute", '/getSoilMoisture');
define("ArduinoWaterPlantRoute", '/waterPlant?duration=');