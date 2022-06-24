const mysql = require('mysql');

const con = mysql.createConnection({
    //host     : 'localhost',
    host: '185.167.96.163',
    user     : 'usuario',
    password : 'usuario',
    database : 'dbs543657a',
    multipleStatements: 'true',
    timezone: '+02:00'
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Database ONLINE");
});

module.exports = con;