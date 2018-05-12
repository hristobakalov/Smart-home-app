var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var SensorSchema = new Schema({
  Name: String,
  PinNameNumber: Number,
  PinNumber: Number,
  IsOutput: Boolean,
  IsEnabled: Boolean,
  Type: String,
  Ip: String,
  WateringDays: [{type: String}],
  WateringTime: Date,
});

mongoose.model('Sensor', SensorSchema);