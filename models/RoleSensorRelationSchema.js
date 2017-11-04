var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var RoleSensorRelationSchema = new Schema({
  RoleId: String,
  SensorId: String
  
});

mongoose.model('RoleSensorRelation', RoleSensorRelationSchema);