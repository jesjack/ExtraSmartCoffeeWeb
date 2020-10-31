const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('*', (req, res, next) => {
    if(!req.session['user']) { res.redirect('/sesion/iniciar?redirect=' + encodeURI('user' + req.url)); }
    else { next(); }
});

router.get('/@/:user', (req, res, next) => {
    if(fs.existsSync(
        __dirname + '/../apis/ExtraDataBase/ExtraDataBase/users/' + req.params['user']
    ))
        res.render('user', {
            title: 'ExtraSmartUser',
            sesion: 'sesion',
            user: req.session['user'],
            target: req.params['user']
        });
    else
        next();
});

router.get('/photo/:user', (req, res, next) => {
    if(fs.existsSync(
        __dirname + '/../apis/ExtraDataBase/ExtraDataBase/users/' + req.params['user'] + '/files/user.gif'
    )) {
        res.sendFile(path.resolve(__dirname + '/../apis/ExtraDataBase/ExtraDataBase/users/' + req.params['user'] + '/files/user.gif'));
    } else {
        res.redirect('/images/ExtraSmartCoffeeW.png');
    }
});

module.exports = router;