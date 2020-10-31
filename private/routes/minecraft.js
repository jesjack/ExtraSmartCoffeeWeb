const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Rcon = require('rcon-client').Rcon;
const session = require('express-session');
const edb = require(__dirname + '/../apis/ExtraDataBase/ExtraDataBase');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const connection = require('../js/mysql-connector');

const key = 'clave super segura maestra 3000 con chispitas de chocolate';

const rcon = {};

connection.query('SELECT * FROM minecraft', (err, result) => {
    if(result) result.forEach(res => {
        if(res.active) {
            rcon[res.alias] = {
                server: new Rcon({
                    host: res['host'],
                    port: res['port'],
                    password: res['password']
                }),
                path: res['path'],
                log: res['path'] + '/logs/latest.log'
            }
        }
    });

    Object.entries(rcon).forEach(([alias, minecraft]) => {
        minecraft.server.connect().then(() => {
            minecraft.server.send('list');
            minecraft.antiTimeOut = setInterval(() => {
                minecraft.server.send('list');
            }, 100000);
        });

        minecraft.res_list = [];
        minecraft.file = '';
        minecraft.test_interval = () => {
            try {
                var file = fs.readFileSync(minecraft.log, {encoding: 'utf-8'});
                if(minecraft.file != file) {
                    minecraft.file = file;
                    minecraft.res_list.forEach(res => {
                        res.send(file);
                    });
                    minecraft.res_list = [];
                }
            } catch(err) {
                try {
                    minecraft.server.connect();
                } catch(err) {
                    clearInterval(minecraft.interval);
                }
            }
        };
        minecraft.interval = setInterval(minecraft.test_interval, 1);
        minecraft.add_res = res => {
            minecraft.res_list.push(res);
            // console.log(rcon['jesjack'].res_list);
            clearInterval(minecraft.interval);
            minecraft.interval = setInterval(minecraft.test_interval, 1);
        };
    });
});

router.all('*', (req, res, next) => {
    if(typeof req.query['user_token'] !== 'undefined') {
        try {
            let token = jwt.decode(req.query['user_token'], key);
            let user = JSON.parse(edb.file('get', 'users/' + token['user'] + '/data.json'));

            if(user['password'] === token['password']) {
                req.session['user'] = token['user'];
                req.session['token'] = true;
            }

            next();
        } catch(err) {
            next();
        }
    } else {
        next();
    }
});


router.get('/', (req, res, next) => {

    if(typeof req.session['user'] !== 'undefined') {
        var sql = 
            `SELECT minecraft.alias FROM minecraft_access access JOIN minecraft ON access.alias = minecraft.alias WHERE access.user = '${req.session['user']}' AND minecraft.active = 1`
        ;

        connection.query(sql, (err, results, fields) => {
            servers_count = results.length;
            if(servers_count == 0) {
                res.redirect('/?msg=Tu usuario no posee un servidor de minecraft activo');
            } else if(servers_count == 1) {
                res.render('minecraft', {
                    title: 'ExtraMinecraftCoffee',
                    minecraft: 'minecraft',
                    user: req.session.user,
                    server: results[0].alias
                });
            } else {
                res.render('minecraft-selector', {
                    title: 'ExtraMinecraftCoffee',
                    minecraft: 'minecraft',
                    user: req.session.user,
                    servers: JSON.stringify(results)
                });
            }
        });
    } else res.redirect('/sesion/iniciar?redirect=minecraft');
});

router.get('/ServerList/:user', (req, res, next) => {
    var user = req.params['user'];
    var servers = [];
    connection.query(`SELECT alias FROM minecraft_access WHERE user = '${user}'`, (error, results, fields) => {
        if(results) results.forEach(access => servers.push(access['alias']));
        res.send(servers);
    });
});

router.get('/@:server', (req, res, next) => {
    try {
        let user = JSON.parse(edb.file('get', 'users/' + req.session['user'] + '/data.json'));
        let encontrado = false;
        let i = 0;
        user.minecraft.forEach(server => {
            if(server.alias == req.params.server)
                encontrado = true;
            if(!encontrado) i++
        });
        if(encontrado) {
            res.render('minecraft', {
                title: 'ExtraMinecraftCoffee',
                minecraft: 'minecraft',
                user: req.session.user,
                server: user.minecraft[i].alias
            });
        } else {
            next();
        }
    } catch(err) {
        next();
    }
});

router.post('/command/:server', async (req, res, next) => {
    try {
        let user = JSON.parse(edb.file('get', 'users/' + req.session['user'] + '/data.json'));
        let encontrado = false;
        user.minecraft.forEach(server => {
            if(server.alias == req.params.server)
                encontrado = true;
        });
        if(encontrado) {
            res.send(await rcon[req.params.server].server.send(req.body.command));
            if(req.session['token']) {
                rcon[req.params['server']].server.send('say <' + req.session['user'] + '> ejecutó [' + req.body['command'] + ']')
            }
        } else {
            next();
        }
        
    } catch(err) {
        next();
    }
});

router.get('/output/:server', (req, res, next) => {
    try {
        let user = JSON.parse(edb.file('get', 'users/' + req.session['user'] + '/data.json'));
        let encontrado = false;
        user.minecraft.forEach(server => {
            if(server.alias == req.params.server)
                encontrado = true;
        });
        if(encontrado) {
            rcon[req.params.server].add_res(res);
        } else {
            next();
        }
        
    } catch(err) {
        next();
    }
});

router.get('/load/:server', (req, res, next) => {
    
    try {
        let user = JSON.parse(edb.file('get', 'users/' + req.session['user'] + '/data.json'));
        let encontrado = false;
        var rps = req.params.server;
        console.log(user.minecraft);
        console.log(rps);
        user.minecraft.forEach(server => {
            if(server.alias == rps) {
                encontrado = true;
            }
        });
        if(encontrado) {
            res.json({
                out: rcon[rps].file
            });
        } else {
            console.log('NO ENCONTRADO')
            next();
        }
    } catch(err) {
        console.log('Cayó en catch');
        next();
    }
});

module.exports = router;

// var _new_data = {
//     password: '',
//     email: ''
// };
// _new_data['minecraft'] = [
//     {
//         alias: 'chess',
//         lvl: 'god'
//     }
// ];
// edb.file('set', 'users/username/data.json', JSON.stringify(_new_data, null, 1));

// try {
//     var clara = require(__dirname + '/../apis/DiscordBots/clara');
// } catch(err) {
//     console.log(err);
// }

// var line = '';

// setInterval(() => {
//     try {
//         let file = fs.readFileSync(rcon.chess.log, { encoding: 'utf-8' }).split('\n');
//         if(line != file[file.length - 2]) {
//             line = file[file.length - 2];
//             let comm = line.split('!p ');
//             if(comm.length == 2) {
//                 let msg = ('!p ' + comm[1]).split('[m')[0];
//                 clara.client.channels.cache.get('729926201401016325').join();
//                 clara.client.channels.cache.get('742358748181430323').send(msg);
//                 // clara.client.channels.cache.get('742358748181430323').send(('yt ' + comm[1]).split('[m')[0]);
//             }
//             let comm2 = line.split('!s');
//             if(comm2.length == 2) {
//                 let msg = '!s';
//                 clara.client.channels.cache.get('742358748181430323').send(msg);
//             }
//             let comm3 = line.split('!m');
//             if(comm3.length == 2) {
//                 let msg = (comm3[1]).split('[m')[0];
//                 clara.client.channels.cache.get('742358748181430323').send('minecraft: ' + msg);
//             }
//         }
//     } catch(err) {
//     }
// }, 1000);