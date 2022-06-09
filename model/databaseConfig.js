var mysql = require('mysql')
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1qwer$#@!",      // this has to be changed to your MySQL password
            database: "sp_air"      // this has to be changed to the sql "database" name


        });
        return conn;
    }
};
module.exports = dbconnect