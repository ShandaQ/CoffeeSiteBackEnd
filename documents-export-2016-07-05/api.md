# Coffee Site API

## Overview

* GET /options/list - list all available grind options
* POST /signup - allow users to signup to the store.
* POST /login - allow existing users to login to the store.
* POST /orders  (authenticated) - allow users to orders coffee, charges purchase with stripe
* GET /orders - (authenticated) return all orders the user has previously submitted

For POST requests, the data posted in the message body should be in JSON format. For your Express body parser (https://github.com/expressjs/body-parser), that means you should use the bodyParser.json() version of its middleware.

## POST /signup

Signs up a new user to the store. Required fields: "username" and "password". POST body format: json.

Example body:

{
  "username": "airportyh",
  "password": "thepassword"
}

Example success response:

{ "status": "ok" }

If username is already taken, it should return a response with status code 409 (Code: response.status(409)) (conflict), with the following response body:

{
  "status": "fail",
  "message": "Username is taken"
}

## POST /login

Logs a user into the store, so that he can order. This API will return an authentication token under the key "token". Users of the API will use this token in making any authenticated requests.

Example body:

{
  "username": "airportyh",
  "password": "thepassword"
}

Example success response:

{
  "status": "ok",
  "token": "HD3YN4C2GGU89CLKROTUNHVGGDU8G4"
}

Example failure response:

{
  "status": "fail",
  "message": "Invalid username or password"
}

## GET /options

Returns the various order options.

Response:

[  
  "Extra coarse",
	"Coarse",
	"Medium-coarse",
	"Medium",
	"Medium-fine",
	"Fine",
	"Extra fine"
]

## POST /orders

Orders coffee. Provides the buy options (grind style, and quantity), delivery address, the stripe token to use to charge the purchase, and an user authentication token.

Example body:

{
  "token": "HD3YN4C2GGU89CLKROTUNHVGGDU8G4", // authentication token
  "order": {
    "options": {
      "grind": "Coarse",
      "quantity": 0.35
    },
    "address": {
      "name": "Foo Bar",
      "address": "123 Foo Bar St",
      "address2": null,
      "city": "FooBar",
      "state": "GA",
      "zipCode": "30309",
      "deliveryDate": "7/21/2016"
    }
  },
  "stripeToken": "ETSDNF7249L8G09CIPLXCHIGCDG89CHPG"
}

Example response:

{
  "status": "ok"
}

Example bad response for failed data requirements. It should return a response with status 400:

{
  "status": "fail",
  "message": "Missing required field: options.grind." // or something to that effect
}

Example bad response for stripe payment. It should return a response with status 402 (payment required):

{
  "status": "fail",
  "message": "Charge failed."
}


This API is authenticated, if the API is not called with a valid logged in user token, it should return a response with status 401 (unauthorized).

{
  "status": "fail",
  "message": "User is not authorized"
}

## GET /orders

Returns all orders user has previously submitted.

Example request (with authentication token):

GET /orders?token=HD3YN4C2GGU89CLKROTUNHVGGDU8G4

Example response:

[
  {
    "options": {
      "grind": "Coarse",
      "quantity": 0.35
    },
    "address": {
      "name": "Foo Bar",
      "address": "123 Foo Bar St",
      "address2": null,
      "city": "FooBar",
      "state": "GA",
      "zipCode": "30309",
      "deliveryDate": "7/21/2016"
    }
  },
  {
    "options": {
      "grind": "Medium",
      "quantity": 0.50
    },
    "address": {
      "name": "Foo Bar",
      "address": "123 Foo Bar St",
      "address2": null,
      "city": "FooBar",
      "state": "GA",
      "zipCode": "30309",
      "deliveryDate": "7/21/2016"
    }
  }
]
