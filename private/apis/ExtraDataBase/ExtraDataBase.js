var fs = require('fs');
const { type } = require('os');

const ExtraDataBase = {
    mkdir: function mkdir(path, call) {
        if(typeof path === 'string') {
            fs.mkdir(__dirname + '/ExtraDataBase/' + path, err => {
                if(err && err.code != 'EEXIST') {
                    console.log(err);
                } if(typeof call == 'function') {
                    call();
                }
            });
        } else {
            var error = {
                msg: 'Parametro invalido. (Utilize solo Strings)',
                author: 'ExtraSmartDataBase'
            };
            if(typeof call == 'function') {
                call();
            } else {
                error.msg = 'Esque estas todo menso 🤣';
            }
            return error;
        }
    }, rmdir: function rmdir(path, call) {
        if(typeof path === 'string') {
            fs.readdir(__dirname + '/ExtraDataBase/' + path, (err, files) => {

                if(err) {
                    console.log(err);
                    if(typeof call == 'function') {
                        call();
                    }
                } else {
                    files.forEach(file => {
                        fs.unlinkSync(__dirname + '/ExtraDataBase/' + path + '/' + file);
                    });
    
                    fs.rmdir(__dirname + '/ExtraDataBase/' + path, err => {
                        if(err && err.code != 'ENOENT') {
                            console.log(err);
                        } if(typeof call == 'function') {
                            call();
                        }
                    });
                }

            });
        } else {
            var error = {
                msg: 'Parametro invalido. (Utilize solo Strings)',
                author: 'ExtraSmartDataBase'
            };
            if(typeof call == 'function') {
                call();
            } else {
                error.msg = 'Esque estas todo menso 🤣';
            }
        }
    }, file: function file(operation, path, par1, par2) {
        if(typeof operation === 'string') {
            switch(operation) {
                case 'get':

                    var file_data = fs.readFileSync(__dirname + '/ExtraDataBase/' + path);
                    if(typeof par1 === 'function') {
                        par1();
                    }

                    return file_data.toString();
                case 'set':

                    if(par1) {
                        fs.writeFile(__dirname + '/ExtraDataBase/' + path, par1, err => {
                            if(err) {
                                console.log(err);
                            } if(typeof par2 === 'function') {
                                par2();
                            }
                        });
                    }

                    break;
                case 'remove':

                    fs.unlink(__dirname + '/ExtraDataBase/' + path, err => {
                        if(err) {
                            console.log(err);
                        } if(typeof par1 === 'function') {
                            par1();
                        }
                    });

                    break;
                default:
                    var error = {
                        msg: 'Operación no valida',
                        author: 'ExtraDataBase'
                    };
                    return error;
            }
        } else {
            var error = {
                msg: 'Operación no valida',
                author: 'ExtraDataBase'
            };
            return error;
        }
    }, path: __dirname + '/ExtraDataBase'
};

fs.mkdir(__dirname + '/ExtraDataBase', err => {
    if(err && err.code != 'EEXIST') {
        console.log(err);
    }
});

module.exports = ExtraDataBase;