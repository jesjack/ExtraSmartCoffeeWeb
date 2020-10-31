var mysql = require('mysql');

const MySQL = {
  query: function query(sql, callback) {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'extrasmartcoffee',
      multipleStatements: true
    });
    
    connection.connect(err => {
      if(err) callback(err);
      else connection.query(sql, callback);

      connection.end();
    });
  },
  connect: function connect() {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'extrasmartcoffee',
      multipleStatements: true
    });
    connection.connect(err => {
      if(err) console.log(err);
    });
    return connection;
  }
};

module.exports = MySQL;