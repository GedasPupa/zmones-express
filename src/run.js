import express from 'express';

const app = express();
 
app.get('/', function (req, res) {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});
 
app.listen(3000);