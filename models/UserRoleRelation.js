var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserRoleRelationSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, ref: 'User' },
  RoleId: { type: Schema.Types.ObjectId, ref: 'Role' }
  
});

mongoose.model('UserRoleRelation', UserRoleRelationSchema);