var randToken = require('rand-token');

var token = randToken.generate(64);
console.log('Token:', token);
