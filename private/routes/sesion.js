const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const connection = require('../js/mysql-connector');
const path = require('path');

const router = express.Router();
const key = 'clave super segura maestra 3000 con chispitas de chocolate';

router.get('/iniciar', (req, res, next) => {
  res.render('login', { title: 'ExtraSmartCoffee' });
}); router.get('/crear', (req, res, next) => {
  res.render('register', { title: 'ExtraSmartCoffee' });
}); router.get('/cerrar', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/token/:token', (req, res, next) => {
	// console.log('testest');
  try {
		var token = jwt.verify(req.params.token, key);
		// console.log(token);
		var password = token.pass;
		var email = token.mail;
		var user = token.user;

		connection.query(
			'INSERT INTO user VALUES ("'+user+'", "'+email+'", "'+password+'", "{}")', (err, result) => {
				if(err) {
					console.log(err);
					res.render('complements/err_user', res.coffee);
				} else {
					fs.mkdir(path.resolve(__dirname + '/../database'), err => {});
					fs.mkdir(path.resolve(__dirname + '/../database/user'), err => {});
					// fs.mkdir(__dirname + '/../database/user/' + user, err => {});
					// console.log(result);
					fs.mkdir(path.resolve(__dirname + '/../database/user/' + user), err => {
						if(err) console.log(err);
					});
					req.session.user = user;
					res.redirect('/');
				}
			}
		);
  } catch(err) {
		console.log(err);
    next();
  }
});

router.post('/', (req, res, next) => {
  var data = req.body;
	console.log(data.operacion);

	switch(data.operacion) {
		case 'registrar': {

			async function exec() {
				console.log('Enviando Mail -> ' + data.correo)
				var transporter = nodemailer.createTransport({
					service: 'Hotmail',
					auth: {
						user: 'jesjack25_03@hotmail.com',
						pass: 'more25**03'
					}
				});

				var msg = fs.readFileSync(__dirname + '/../html/correo.html');
				msg = msg.toString().split('***');
				var token = jwt.sign({
					user: data.usuario,
					mail: data.correo,
					pass: data.pass
				}, key);

				var mailOptions = {
					from: 'ExtraSmartCoffee <jesjack25_03@hotmail.com>',
					to: data.correo,
					subject: 'Cuenta de usuario ExtraSmartCoffee',
					html: msg[0] + 'http://'+req.get('host')+'/sesion/token/' + token + msg[1]
				};

				transporter.sendMail(mailOptions, (err, res_) => {
					if(err) {
						res.render('complements/non_corr');
					} else {
						res.render('complements/rev_corr');
					}
				});
			}
			exec();

			break;
		} case 'logear': {
			var pass = data.pass;
			var user = data.usuario;

			connection.query('SELECT password FROM user WHERE user = "'+user+'"', (err, result) => {
				console.log(err, result, pass)
				if(err) {
					console.log(err);
					res.redirect('/?error=pass');
				} else {
					if(result.length > 0 && result[0]['password'] == pass) {
						req.session.user = user;
						res.redirect('/' + (req.query['redirect']?req.query['redirect']:''));
					} else res.redirect('/?error=pass');
				}
			});
			break;
		} default: {
			next();
		}
	}
});

module.exports = router;