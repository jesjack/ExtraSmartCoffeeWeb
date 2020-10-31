const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const r = express.Router();
const key = 'clave super segura maestra 3000 con chispitas de chocolate';

r.get('/link/:token/:date', (req, res, next) => {
  var tokenPath = path.join(jwt.verify(req.params['token'], key));
  var date = req.params['date'];
  
  var userPath = path.join(__dirname + `/../database/user/${req.session['user']}/files/`);
  if(tokenPath.split(userPath).length == 2) {
    var finalToken = jwt.sign({
      path: tokenPath,
      date: date
    }, key);
    res.send('https://extrasmartcoffee.org/file_token/download/' + finalToken);
  } else {
    res.send('error');
  }
});

r.get('/download/:token', (req, res, next) => {
  
});

module.exports = r;