const Rcon = require('rcon-client').Rcon;
const connection = require('../mysql-connector');
const fs = require('fs');

const rcon = {};

connection.query('SELECT * FROM minecraft', (error, results, fields) => {
  if(results) {
    results.forEach(result => {
      if(result['active']) {
        rcon[result['alias']] = {
          server: new Rcon({
            host: result['host'],
            port: result['port'],
            password: result['password']
          }),
          path: result['path'],
          log: result['path'] + '/logs/latest.log'
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
          console.log(err);
        }
      };
      minecraft.interval = setInterval(minecraft.test_interval, 1);
      minecraft.add_res = res => {
        minecraft.res_list.push(res);
        clearInterval(minecraft.interval);
        minecraft.interval = setInterval(minecraft.test_interval, 1);
      };
    });
  }
});

module.exports = {
  getServers: function getServers(user, callback) {
    var sql = `SELECT minecraft.alias FROM minecraft_access access JOIN minecraft ON access.alias = minecraft.alias WHERE access.user = '${user}' AND minecraft.active = 1`;
    connection.query(sql, (error, results, fields) => {
      var servers = [];
      results.forEach(result => {
        servers.push(result['alias']);
      });
      callback(servers);
    });
  },
  serverAccess: function serverAccess(user, server, callback) {
    var sql = `SELECT level FROM minecraft_access JOIN minecraft ON minecraft_access.alias = minecraft.alias WHERE minecraft_access.user = '${user}' AND minecraft.alias = '${server}' AND minecraft.active = 1`;
    connection.query(sql, (error, results, fields) => {
      callback(results && results[0] && results[0]['level'] == 0);
    });
  },
  getLog: function getLog(server, callback) {
    callback(rcon[server].file);
  },
  addRes: function addRes(server, res) {
    rcon[server].add_res(res);
  },
  command: async function command(server, command, callback) {
    callback(await rcon[server].server.send(command));
  }
}