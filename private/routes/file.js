const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const multer = require('multer');
const pathhhh = require('path');
const rimraf = require('rimraf');
const archiver = require('archiver');
const readline = require('readline');
const connection = require('../js/mysql-connector');
const jwt = require('jsonwebtoken');

const router = express.Router();
const key = 'clave super segura maestra 3000 con chispitas de chocolate';

var upload = multer({ dest: 'private/uploads/' });
var cpUpload = upload.fields([{
    name: 'file'
}]);

// const edb = require(__dirname + '/../apis/ExtraDataBase/ExtraDataBase');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

router.post('/token/prepare', (req, res, next) => {
    var token = req.body['token'];
    var element = jwt.verify(token, key).split('/');
    element = element[element.length - 1];
    if(req.session['user']) res.render('prepare-token', {
        title: 'ExtraSmartShare',
        user: req.session['user'],
        token: req.body['token'],
        element: element
    }); else next();
});

router.post('/compress', (req, res, next) => {
    if(req.session['user']) {
        res.sendStatus(234);
        var reqPath = req.body['path'];
        reqPath = reqPath.split('/');
    
        var fileUser = true;
        var serverName = reqPath[3];
        connection.query('SELECT * FROM minecraft_access WHERE alias = "'+serverName+'" AND user = "'+req.session['user']+'"', (err, results, fields) => {
            if(reqPath[2] == 'minecraft') {
                fileUser = false;
                /**
                 * Intentando comprimir archivo de minecraft.
                 * Hay que comprobar que el servidor es accesible para el usuario.
                 * 
                 * En caso contrario se redijirira a una compresion de un posible archivo de usuario
                 * dentro de la carpeta minecraft
                 */
        
                
                if(typeof serverName !== 'undefined') {
                    if(results.length >= 1 && results[0]['level'] == 0){
                        connection.query('SELECT path FROM minecraft WHERE alias = "'+results[0]['alias']+'"', (err2, results2, fields2) => {
                            serverPath = results2[0]['path'];
                            /**
                             * Servidor concuerda con usuario
                             * Se procederá a generar un path personalizado segun los criterios.
                             */
                            var split = req.body['path'].split('/minecraft/' + serverName + '/')[1];
                            if(typeof split === 'undefined') split = '';
                            var completePath = serverPath + split; //El path absoluto a comprimir
                            compressFileToUser(__dirname + '/../database/user/' + req.session['user'] + '/files/', completePath, req.session['user']);
                        });
                    }
                    else
                        fileUser = true;
                } else {
                    fileUser = true;
                }
        
            } if(fileUser) {
                /**
                 * Intentando comprimir archivo de usuario.
                 */
                var path = '/' + req.body['path'].split('file/')[1];
                let completePath = 
                    __dirname +
                    '/../database/user/' +
                    req.session.user +
                    '/files' +
                    path
                ;
                compressFileToUser(__dirname + '/../database/user/' + req.session['user'] + '/files/', completePath, req.session['user']);
            }
        });
    } else {
        res.sendStatus(403);
    }
});


router.get('/minecraft', (req, res, next) => {
    if(req.session.user) {
        var path = decodeURI(req.url);
        if(path.charAt(path.length - 1) != '/')
            path += '/';
        connection.query('SELECT level, alias FROM minecraft_access WHERE user = "'+req.session['user']+'"', (err, results, fields) => {
            var file = [];
            results.forEach(server => {
                if(server['level'] == 0) file.push(server['alias']);
            });
            res.render('file', {
                title: 'ExtraSmartCoffee',
                user: req.session.user,
                file: file,
                path: path
            });
        });
    } else {
        res.redirect('/sesion/iniciar?redirect=' + encodeURI('file' + req.url));
    }
});

router.get('/minecraft/:server/', (req, res, next) => {
    if(req.session['user']) {
        var path = decodeURI(req.url);
        if(path.charAt(path.length - 1) != '/')
            path += '/';
        getServerPath(req.session['user'], req.params['server'], Path => {
            var completePath = Path;
            let file = fs.readdirSync(completePath);
            res.render('file', {
                title: 'ExtraSmartCoffee',
                user: req.session.user,
                file: file,
                path: path,
                completePath: completePath
            });
        });
    } else {
        res.redirect('/sesion/iniciar?redirect=' + encodeURI('file' + req.url));
    }
});
router.get('/minecraft/:server/*', (req, res, next) => {
    var reqParams = req.params;
    if(req.session['user']) {
        var path = decodeURI(req.url);
        if(path.charAt(path.length - 1) != '/')
            path += '/';
        getServerPath(req.session['user'], reqParams['server'], Path => {
            var completePath = Path + path.split('/'+reqParams['server']+'/')[1];
            try {
                let file = fs.readdirSync(completePath);
                res.render('file', {
                    title: 'ExtraSmartCoffee',
                    user: req.session.user,
                    file: file,
                    path: path,
                    completePath: completePath
                });
            } catch (err) {
                completePath = completePath.slice(0, -1);
                res.sendFile(completePath);
            }
        });
    } else {
        res.redirect('/sesion/iniciar?redirect=' + encodeURI('file' + req.url));
    }
});
router.delete('/minecraft/:server/*', (req, res, next) => {
    if(req.session['user']) {
        getServerPath(req.session['user'], req.params['server'], Path => {
            var path = decodeURI(req.url);
            var completePath = Path + path.split('/'+req.params['server']+'/')[1];
            rimraf.sync(completePath);
            res.sendStatus(200);
        });
    } else {
        res.redirect('/sesion/iniciar?redirect=' + encodeURI('file' + req.url));
    }
});

router.post('/createfile', cpUpload, (req, res, next) => {
    let fileName = req.body['fileName'];
    let type = (fileName.charAt(fileName.length - 1) == '/') ? 'folder' : 'file';
    let completePath = req.body['completePath'];

    switch(type) {
        case 'folder':
            fs.mkdir(completePath + fileName, err => {
                if(err) {
                    console.log(err);
                }
                res.redirect(req.body['preURL']);
            });
            break;
        case 'file':
            
            var file = req.files['file'][0];
            fs.rename(file.path, completePath + fileName, err => {
                if(err) {
                    console.log(err);
                }
                res.redirect(req.body['preURL']);
            });

            break;
    }
});

router.delete('*', (req, res, next) => {
    if(req.session.user) {
        var path = decodeURI(req.url);
        let completePath = 
            __dirname +
            '/../database/user/' +
            req.session.user +
            '/files' +
            path
        ;
        rimraf.sync(completePath);
        res.sendStatus(200);
    } else {
        res.redirect('/sesion/iniciar?redirect=' + encodeURI('file' + req.url));
    }
});

router.get('*', (req, res, next) => {
    // console.log('mmmm');
    if(req.session.user) {
        var path = decodeURI(req.url);
        try {
            fs.mkdirSync(pathhhh.resolve(__dirname + '/../database/user/' + req.session.user + '/files/'));
            // console.log('mmm');
        } catch (error) {
            // console.log('Error: ' + JSON.stringify(error, null, 2));
            if(error.code != 'EEXIST')
                console.log(error);
        }
        try {
            // Es carpeta
            if(path.charAt(path.length - 1) != '/')
                path += '/';
            let completePath = 
                __dirname +
                '/../database/user/' +
                req.session.user +
                '/files' +
                path
            ;
            let file = fs.readdirSync(completePath);
            var allPaths = [];
            file.forEach(f => {
                var fpt = jwt.sign(completePath + f, key);
                allPaths.push(fpt);
            });
            res.render('file', {
                title: 'ExtraSmartCoffee',
                user: req.session.user,
                file: file,
                path: path,
                completePath: completePath,
                allPaths: allPaths
            });
        } catch(err) {
            // Es archivo
            path = path.slice(0, -1);
            let pathToFile = __dirname + '/../database/user/' + req.session.user + '/files' + path;
            if(fs.existsSync(pathhhh.resolve(pathToFile)))
                res.sendFile(pathhhh.resolve(pathToFile));
            else {
                next();
                // console.log('wtf');
            }
        }
    } else {
        next();
    }
});

router.get('/user.gif', (req, res, next) => {
    res.sendFile(pathhhh.resolve(__dirname + '/../../public/images/ExtraSmartCoffeeW.png'));
});

module.exports = router;

function compressFileToUser(userFilesPath, fileToZipPath, user) {
    var preName = Math.random() + '';
    var zipName = (fileToZipPath.split('/'))[fileToZipPath.split('/').length - 1];
    if((typeof zipName.length === 'undefined') || zipName.length == 0)
        zipName = (fileToZipPath.split('/'))[fileToZipPath.split('/').length - 2];
    try{ fs.mkdirSync(__dirname + '/../zips/' + user); }catch(err){}
    try{ fs.mkdirSync(userFilesPath + 'zips'); }catch(err){}
    try{ fs.unlinkSync(__dirname + '/../zips/' + user + '/' + preName + '.zip'); }catch(err){}
    var output = fs.createWriteStream(__dirname + '/../zips/' + user + '/' + preName + '.zip');
    var archive = archiver('zip');

    output.on('close', () => {
        console.log(archive.pointer() + ' bytes totales.');

        fs.renameSync(__dirname + '/../zips/' + user + '/' + preName + '.zip', userFilesPath + 'zips/' + zipName + '.zip');

        console.log('La compresion de ' + user + '/' + zipName + ' ah finalizado');
    });

    archive.on('error', err => {
        console.log(err);
    });

    archive.on('progress', p => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(JSON.stringify(p));
    });

    archive.pipe(output);
    
    fs.lstat(fileToZipPath, (err, stats) => {
        if(err) { console.log(err) }
        if(stats.isFile()) { archive.file(fileToZipPath, false); }
        else { archive.directory(fileToZipPath, false) }
        archive.finalize();
    });
} function getServerPath(user, alias, callback) {
    var sql = 
    `SELECT minecraft.path AS 'path' ` +
        `FROM minecraft_access access ` +
        `JOIN minecraft ` +
            `ON access.alias = minecraft.alias ` +
        `WHERE access.user = '${user}' ` +
        `AND access.alias = '${alias}' ` +
        `AND access.level = 0 `;

    connection.query(sql, (err, results, fields) => {
        if(err) {
            console.log(err);
        } else if(results.length >= 1) {
            var path = results[0]['path'];
            callback(path);
        }
    });
}