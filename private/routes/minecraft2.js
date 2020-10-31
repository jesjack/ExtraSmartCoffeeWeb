const minecraft = require('../js/minecraft');
const express = require('express');
// const connection = require('../js/mysql-connector');

const router = express.Router();

router.get('/', (req, res, next) => {
  var user = req.session['user'];
  if(typeof user !== 'undefined') {
    next();
    // minecraft.getServers(user, servers => {
    //   res.coffee['servers'] = servers;
    //   res.render('minecraft', res.coffee);
    // });
  } else { next(); }
});

router.get('/@/:server', (req, res, next) => {
  var user = req.session['user'];
  var server = req.params['server'];
  minecraft.serverAccess(user, server, ok => {
    if(ok) {
      res.coffee['server'] = server;
      res.render('minecraft', res.coffee);
    } else { next(); }
  });
});

router.get('/load/:server', (req, res, next) => {
  var user = req.session['user'];
  var server = req.params['server'];
  minecraft.serverAccess(user, server, ok => {
    if(ok) {
      minecraft.getLog(server, log => {
        res.send(log);
      });
    } else { next(); }
  });
});

router.get('/output/:server', (req, res, next) => {
  var user = req.session['user'];
  var server = req.params['server'];
  minecraft.serverAccess(user, server, ok => {
    if(ok) {
      minecraft.addRes(server, res);
    } else { next(); }
  })
});

router.post('/command/:server', (req, res, next) => {
  var user = req.session['user'];
  var server = req.params['server'];
  var command = req.body['command']
  minecraft.serverAccess(user, server, ok => {
    if(ok) {
      minecraft.command(server, command, response => {
        res.send(response);
      });
    } else { next(); }
  });
});

module.exports = router;