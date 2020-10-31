const fs = require('fs');

const connection = require('./mysql-connector');
const path = __dirname + '/../sql/';
const name = 'run' + '.sql';
const log = __dirname + '/../log/executeSQL/last.log';
const log2 = __dirname + '/../log/executeSQL/logs/' + Date.now() + '.log';

const exist = fs.existsSync(path + name);

if(exist) {
  const sql = fs.readFileSync(path + name).toString();
  if(sql != '') {
    var toFile = sql + '\n';
    connection.query(sql, (err, results, fields) => {

      if(err) toFile += JSON.stringify(err, null, 2);
      if(results) toFile += JSON.stringify(results, null, 2);
      if(fields) toFile += JSON.stringify(fields, null, 2);

      fs.writeFile(log, toFile, err2 => {
        if(err2) console.log(err2);
      });fs.writeFile(log2, toFile, err2 => {
        if(err2) console.log(err2);
      });

    });
  }
}