# Coffee Site Backend

Today you will create the API backend for the Coffee Store. The backend is to be designed in such a way that any type of app (command line app, mobile app) could potentially use it to order coffee. Look at api.md for a detailed overview of the API endpoints you will be implementing.

While developing you backend, you will be using curl or Postman to tests its functionality to ensure they are behaving correctly.

For POST requests, the data posted in the message body should be in JSON format. For your Express body parser (https://github.com/expressjs/body-parser), that means you should use the bodyParser.json() version of its middleware. When using Postman, to specify the message body

* Select the "Body" tab under the URL address text field
* Make sure the "raw" option is selected
* Change the right most option (normally "Text" or "Text (text/plain)") to "JSON (application/json)"

## 1st API: GET /options

The first API you'll implement will simply return all the coffee grind options the store provides. They are:

* Extra coarse
* Coarse
* Medium-coarse
* Medium
* Medium-fine
* Fine
* Extra fine

This API will return these string values inside an array. See api.md for more details. Use Postman or curl to test your code.

## Create your user model

You will create your Mongoose user model in order to support user registration, login, and storing orders. Create a user.js and create the model there. Don't forget to export it via setting module.exports so that it can be used by other Node programs. The user model needs the following fields:

* _id - because usernames are unique, you will use the _id field to store usernames.
* encryptedPassword - you will store the encrypted password for the user to be used during login
* authenticationTokens - you will store an array of authentication tokens for each user, stored as a string.
* orders - the orders this user has previously submitted. Also see GET /orders or POST /orders in api.md. An example order has the following format:

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
    }

## Add Validation for User model

Add validation on the model to ensure that:

* _id is provided
* encryptedPassword is provided
* both the token and expires fields of authenticationTokens are provided
* both grind and quantity fields of order.options are provided
* all but the address2 field of order.address are provided

## POST /signup

Implement the POST /signup API to allow user registration. See api.md for details of the API. When this API is called, you will store a new user document in the database. The new user will have its _id and encryptedPassword populated, leaving authenticationTokens and orders empty. You will use the bcrypt module to convert the user's supplied password to the encryptedPassword - you will use the value of 10 for saltRounds. See documentation for bcrypt: https://www.npmjs.com/package/bcrypt. Use the async usage as recommended.

## POST /login

Implement the POST /login API to allow user login. The message body will be in JSON format. See api.md for details of the API. When this API is called, you will

1. fetch the user from the database by _id
2. check his/her password using the bcrypt module (compare() method)
  * if the credentials check out
    1. create an authentication token 64-character token using the rand-token module: https://www.npmjs.com/package/rand-token
    2. store the token in the user's authenticationTokens array.
    3. save the user
    4. return the token in the response body. See api.md for more details.
  * else return a failure with an error message. See api.md for details.

## POST /orders

Implement the POST /orders API to allow submitting an order. See api.md for more details. For the time being, you will *not* implement the functionality of charging a credit card. We will defer that to an upcoming day. The message body will be in JSON format. When an order is submitted

1. fetch the user by matching the "token" key of the message body against any token in the users authenticationTokens array
2. add the new order from the message body to the user's orders.
3. save the user
4. return an "ok" response. See api.md for more details.

## GET /orders

Implement the GET /orders API to allow users to see their previous orders. See api.md for more details.

1. fetch the user by matching the "token" query parameter against any token in the users authenticationTokens array
2. return the user's orders in the response. See api.md for more details.
