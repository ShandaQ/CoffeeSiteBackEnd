var express = require('express');

// allows a web app in a different domain to access this api
var cors = require('cors');

var app = express();
var session = require('express-session');

//middleware
var bodyParser = require('body-parser');
var bcrypt = require('my-bcrypt');
// var bcrypt = require('bcrypt');

var randToken = require('rand-token');
// var token = randToken.generate(64);

var mongoose = require('mongoose');

// mongoLab
var mongoCreds = require('./mongo_creds.json');

mongoose.connect('mongodb://' + mongoCreds.username + ':' + mongoCreds.password + '@ds031915.mlab.com:31915/sqk_coffee_site');
var User = require('./user');

// need to charge user credit card for order
var stripe = require("stripe")("sk_test_YDRmKlCdVAFP4dj3KiV8nJXE");

// allows a web app in a different domain to access this api
app.use(cors());

// middleware
// register the application with the middleware
// parsers the json formated body data
// save the requests in req.body, as a javascript
app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost/users');

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
  var credentials = req.body;
  var encryptedPassword;

  User.findById(credentials.username, function(err, user){
    if(err){
      console.error(err.message);
      return;
    }
    // username exist in the DB and use needs to pick a different username
    if(user){
      console.log('pick a diff username');
      res
        .status(409)
        .json({"status": "failed", "message": "user name is taken"});
    }else{
      // save username and pswd to the database
      //bcrypt user password
      console.log("credentials", credentials);
      bcrypt.hash(credentials.password, 10, function(err, encryptedPassword) {
        if (err) {
          console.error("bcrypr hash error" ,err.message);
          return;
        }
        console.log('Password:', credentials.password);
        console.log('Encrypted password:', encryptedPassword);
        User.create({
          _id: credentials.username,
          password: encryptedPassword
        }, function(err, user){
          if(err){
            console.log(err);
          }
          // saved
          res.json({"status": "ok"});
        });
      });
    }
  });
});

app.post('/login', function(req, res){
  var credentials = req.body;

  // User.findById(credentials.username)
  User.findOne({_id:credentials.username},function(err, user){
// if error the user name does not exist in the database
    if(err){
      //database error
      console.error(err.message);
      res.json({
        status: "fail",
        message: "database connectivity error"
      });
      return;
    }

    // checking to see if user gets found
    if(!user){
      res.status(409);
      res.json({
        status: "fail",
        message: "Invalid username or password"
      });
      return;
    }

// if the user name exist check to see if they enter the correct password
    bcrypt.compare(credentials.password, user.password, function(err, match){
      if(err || !match){
        console.error(err.message);
        res.status(409);
        res.json({
          status: 'fail',
          message: "Invalid username or password"
        });
        return;
      }

// if username and password are correct update the user and push a session token to the database
      var token = randToken.generate(64);
      if(match){
        User.update(
          {_id: credentials.username},
          {$push:
            {authenticationTokens: token}
          },function(err, status){
            if(err){
              console.error(err.message);
              res.json({
                status: 'fail',
                message: 'database connectivity error'
              });
              return;
            }
          }
        );
        res.json({
          status: 'success',
          message:'update completed',
          token: token
        });
        return;
      }else {
        // console.error(err.message);
        res.json({
          status: 'fail',
          message:'updated not successful'
        });
        return;
      }
    }); // end compare
  }); // end User.findOne
}); // end app.post - login

app.post('/orders', authRequired, function(req, res){
  // var tokenKey = req.body.token;
  var newOrder = req.body;

  User.update(
    // {authenticationTokens: tokenKey},
    {$push:
      {orders: req.body.orders}
    },function(err, status){
      if(err){
        res.send({
          status: 'fail',
          message:'missing required fields'
        });
        return;
      }
      console.log("status",status);
      res.send('ok');
    } // end callback function
  ); //end User.update
});


app.get('/orders', authRequired, function(req, res){
  // get/orders?token="something"

  // var token = req.query.token;

  // User.findOne({authenticationTokens: token}, function(err, user){
  //   if(err){
  //     console.error(err.message);
  //     res.json({
  //       status: 'fail',
  //       message: 'database connectivity error'
  //     });
  //     return;
  //   }
     res.send(req.user.orders);
  // });
});

// handler for the credit card charge
// stripe token, amount
app.post('/charge', function(req, res){
  var amount = req.body.total;
  var token = req.body.token;

  // makes the chrge using the credit card - with the matching token
  // https://stripe.com/docs/api/node#create_charge
  stripe.charges.create({
    amount: amount,
    currency: "usd",
    source: token,
    description: "Charges for coffee"
  },function(err, charge){
    if(err){
      res.status(409);
      res.json({
        status:'fail',
        error: err.message
      });
      return;
    }
    res.json({
      status: 'ok',
      charge: charge
    });
  });
});

// middleware
function authRequired(req, res, next){
  var token = req.query.token || req.body.token;

  if(!token){
    res.json({
      status: 'failed',
      message: 'please login'
    });
    return;
  }

  User.findOne({authenticationTokens: token}, function(err, user){
    //console.log(user);
    // set req.user to user so that it can be used in the app.get and .post call
    req.user = user;
    if(err){
      console.error(err.message);
      res.json({
        status: 'fail',
        message: 'database connectivity error'
      });
      return;
    }
    if(user) {
      next();
    } else {
      res.json({message: 'please login'});
    }
  });
}

app.listen(8000, function(){
  console.log("Listening on port 8000");
});
