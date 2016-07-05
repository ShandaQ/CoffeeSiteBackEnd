var express = require('express');
var session = require('express-session');
var app = express();

app.use(session({
  secret: 'hutnseh893lg2rshc.,rnuc',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/', function(request, response) {
  // IN NEW AUTHENTICATION SCHEME
  // if credientials match
  // generate a token
  // associate token with the logged in user
  // API user will use this token in subsequent requests that
  // require authorization
  request.session.user = 'airportyh';
  response.send('oueouk');
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
