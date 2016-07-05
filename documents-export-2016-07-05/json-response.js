var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());




app.get('/', function(request, response) {
  // sends a json response in the message body
  response.json({
    message: 'Hello, world'
  });

  // equivalent to
  var jsonText = JSON.stringify({
    message: 'Hello, world'
  });
  response.send(jsonText);
});













app.post('/', function(request, response) {
  // reads in json format data from the request body
  var name = request.body.name;
  response.json({
    message: 'Hello, ' + name
  });
});











app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
