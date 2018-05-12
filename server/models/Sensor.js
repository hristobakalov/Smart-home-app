var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var SensorSchema = new Schema({
  Name: String,
  PinNameNumber: Number,
  PinNumber: Number,
  IsOutput: Boolean,
  IsEnabled: Boolean,
  Type: String,
  Ip: String
});

mongoose.model('Sensor', SensorSchema);