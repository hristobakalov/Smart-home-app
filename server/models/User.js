var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  Email: String,
  Password: String,
  FirstName: String,
  LastName: String,
  IsApproved: Boolean,
  PasswordToken: String
});

mongoose.model('User', UserSchema);