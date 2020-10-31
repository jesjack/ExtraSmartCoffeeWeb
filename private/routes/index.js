const express = require('express');
const router = express.Router();
const connection = require('../js/mysql-connector');
const minecraft = require('../js/minecraft');

router.use((req, res, next) => {
	if(typeof req.query['user_token'] !== 'undefined') {
		var token = jwt.decode(req.query['user_token'], key);
		connection.query(
			`SELECT password FROM user WHERE user = '${token['user']}'`,
			(error, results, fields) => {
				if(results && (results[0]['password'] === token['password'])) {
					req.session['user'] = token['user'];
				}
				next();
			}
		);
	} else {
		next();
	}
});

router.use((req, res, next) => {
	res.coffee = {
		title: 'ExtraSmartCoffee',
		user: req.session['user'],
		_GET: req.query,
		_POST: req.body
	};
	next();
});

router.use((req, res, next) => {
	if(typeof req.session['user'] !== 'undefined') {
    minecraft.getServers(req.session['user'], servers => {
			res.coffee['servers'] = servers;
			next();
    });    
  } else {
		next();
	}
});

router.get('/', (req, res, next) => {
	res.coffee['nav'] = 'index';
	res.render('index', res.coffee);
});

module.exports = router;