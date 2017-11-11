var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var RoleSensorRelationSchema = new Schema({
  RoleId: { type: Schema.Types.ObjectId, ref: 'Role' },
  SensorId: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }]
  
});

mongoose.model('RoleSensorRelation', RoleSensorRelationSchema);