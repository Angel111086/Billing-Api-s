var mysql = require('mysql');

//Initialize pool

// var pool = mysql.createPool({
//    connectionLimit : 100, //important
//     host     : 'localhost',
//     socketPath : '/var/run/mysqld/mysqld.sock',
//     user     : 'root',
//     password : '123456',
//     database : 'healthcott_billingdb',
//     debug    :  false,
// }); 

var pool = mysql.createPool({
    connectionLimit : 100, //important    
    host     : 'localhost',
    port     :  3308,
    user     : 'root',
    password : '',
    database : 'healthcott_billingdb',
    debug    :  false,
    insecureAuth : true,
    charset : 'utf8mb4',
    multipleStatements: true
}); 


pool.getConnection(function (err, connection)  {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.' + err)
    }
  }

  if (connection){
    console.log("connected")
    connection.release();
    return;
  }
})

module.exports = pool;