# CoffeeSiteBackEnd

Part 1 -
  Creating a user model
    - using mongoose npm
    - user.js

  Creating a API
  Database the houses the user information in JSON format
    - npm
      - express
      - session
      - bodyParser
      - bcrypt -  encrypt user password
      - randToken - assign a user a token every time they login and store the token in a array in side of the mongodb
      - mongoose
        - create/update users, and get information from the database
      -  middleware
        function authRequired - checks to make sure that the user is authorized before allowing them to order items
