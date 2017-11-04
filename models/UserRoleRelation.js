var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserRoleRelationSchema = new Schema({
  UserId: String,
  RoleId: String
  
});

mongoose.model('UserRoleRelation', UserRoleRelationSchema);