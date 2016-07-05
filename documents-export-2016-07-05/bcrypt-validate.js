var bcrypt = require('bcrypt');

var myPassword = 'opensesame';
var encryptedPassword = '$2a$10$PJO8bCQFrwUb12DNfqIttO1ugVrPeJQbUHIiYrXXF1rBWtZa//lcK';

bcrypt.compare(myPassword, encryptedPassword, function(err, matched) {
  if (err) {
    console.error(err.message);
    return;
  }
  if (matched) {
    console.log('You are logged in!');
  } else {
    console.log('Invalid password.');
  }
})
