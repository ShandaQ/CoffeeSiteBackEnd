var bcrypt = require('bcrypt');

// Example of how to generate an encrypted password using bcrypt

var myPassword = 'opensesame';
var saltRounds = 10;
bcrypt.hash(myPassword, saltRounds, function(err, encryptedPassword) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Password:', myPassword);
  console.log('Encrypted password:', encryptedPassword);
});
