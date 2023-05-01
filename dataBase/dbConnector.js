var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    port: 8000,
    database: "new_schema"
});



module.exports = pool;