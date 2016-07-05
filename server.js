var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var randToken = require('rand-token');
var token = randToken.generate(64);

var mongoose = require('mongoose');
var User = require('./user');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/users');


app.get('/options', function(req, res){
  res.json({
    grind:[
      "Extra coarse",
    	"Coarse",
    	"Medium-coarse",
    	"Medium",
    	"Medium-fine",
    	"Fine",
    	"Extra fine"
    ]
  });
});

app.post('/signup', function(req, res) {
  var crendentails = req.body;
  var encryptedPassword;

  User.findById(crendentails.username, function(err, user){
    if(err){
      console.error(err.message);
      return;
    }
    // username exist in the DB and use needs to pick a different username
    if(user){
      console.log('pick a diff username');
      res.json({"status": "failed", "message": "user name is taken"});
    }else{
      // save username and pswd to the database
      //bcrypt user password
      bcrypt.hash(crendentails.password, 10, function(err, encryptedPassword) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Password:', crendentails.password);
        console.log('Encrypted password:', encryptedPassword);
        User.create({
          _id: crendentails.username,
          password: encryptedPassword
        }, function(err, user){
          if(err){
            return console.log(err);
          }
          // saved
          res.json({"status": "ok"});
        });
      });
    }
  });
});


app.listen(8000, function(){
  console.log("Listening on port 8000");
});
