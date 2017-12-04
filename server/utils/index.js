const exec = require('child_process').execSync;
var bcrypt = require('bcrypt');
// function pwm (pin, value) {
    // return exec(`echo "${pin}=${parseFloat(value)}" > /dev/pi-blaster`);
// };

function turn (pin, state) {
    const value = state == 1 ? 1 : 0;
	console.log(value);
    exec(`gpio -g mode ${pin} out`);
    return exec(`gpio -g write ${pin} ${value}`);
}

function cryptPassword(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return callback(err);

    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash);
    });
  });
};

function comparePassword(plainPass, hashword, callback) {
   bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
       return err == null ?
           callback(null, isPasswordMatch) :
           callback(err);
   });
};
module.exports = {
    // pwm,
    turn,
	cryptPassword,
	comparePassword
};