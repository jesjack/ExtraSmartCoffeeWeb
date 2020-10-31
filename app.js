const express = require('express');
const exphbs  = require('express-handlebars');
const php = require('php');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const key = 'clave super segura maestra 3000 con chispitas de chocolate';

//Session y datos persistentes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: key,
    resave: true,
    saveUninitialized: true
}));

//Morgan
morgan.token(`status`, (req, res) => {
	const status = (typeof res.headersSent !== `boolean`
		? Boolean(res._header)
		: res.headersSent)
			? res.statusCode
			: undefined;
	// get status color
	const color =
		status >= 500
			? 31 // red
			: status >= 400
				? 33 // yellow
				: status >= 300
					? 36 // cyan
					: status >= 200
						? 32 // green
						: 0; // no color
	return `\x1b[${color}m${status}\x1b[0m`;
});
morgan.token('time', (req, res) => {
	var date = new Date();
	var hora = date.getHours();
	var minuto = date.getMinutes();
	var segundo = date.getSeconds();
	return hora + ":" + minuto + ":" + segundo
});
app.use(morgan('ESC: :method :status :url :response-time ms ~ :time', {}));

//php engine
app.set('views', __dirname + "/private/views/");
app.engine('handlebars', exphbs());
app.engine('php', php.__express);
app.set('view engine', 'php');

//Definiendo y usando rutas
const routes = {
	'/': 'index',
	'/minecraft': 'minecraft2',
	'/file': 'file',
	'/user': 'user',
	'/file_token': 'file_token',
	'/sesion': 'sesion'
};

Object.entries(routes).forEach(([url, file]) => {
	app.use(url, require(`${__dirname}/private/routes/${file}`))
});

app.use(express.static(__dirname + "/public"));

//Manejo de errores
app.use((req, res, next) => {
	res.coffee['status'] = 404;
	res.coffee['error'] = 'Página no encontrada.';
	res.coffee['stack'] = 'Intenta con otra dirección.'
	res.render('404', res.coffee);
});

app.use((err, req, res, next) => {
	res.coffee['status'] = 500;
	res.coffee['error'] = err.toString();
	res.coffee['stack'] = err.stack;
	res.render('404', res.coffee);
});

//Servidor
const https = require('https');
const http = require('http');

try {
	var server = https.createServer({
		key: fs.readFileSync('/etc/letsencrypt/live/extrasmart.coffee/privkey.pem'),
		cert: fs.readFileSync('/etc/letsencrypt/live/extrasmart.coffee/fullchain.pem')
	}, app);
} catch(error) {
  var server = http.createServer(app);
}

server.listen(3000, err => {
	if(err) {
		console.log(err);
	} else {
		console.log('Servidor ExtraSmart.Coffee iniciado en puerto ' + 3000);
	}
});

require('./private/js/executeSQL');