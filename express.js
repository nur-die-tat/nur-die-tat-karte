var express = require('express');
var app = express();

app.use('/src', express.static('src'));
app.use('/node_modules', express.static('node_modules'));
app.use('/layers', express.static('layers'));

app.listen(3000, function () {
  console.log('App is listening on localhost:3000!');
});