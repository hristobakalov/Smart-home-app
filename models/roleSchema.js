var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var RoleSchema = new Schema({
  Name: String
});

mongoose.model('Role', RoleSchema);