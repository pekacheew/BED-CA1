var db = require('./databaseConfig.js');

module.exports = {

// Endpoint 05 POST /airport/ -> "INSERT new airport data into the database"
insertAirport: function(name,country,description, callback) {
    var conn = db.getConnection();
    conn.connect(function (err){
        if (err) {
            console.log(err)
            return callback(err, null);
             
        } else {
            var sql = 
            `
            INSERT INTO 
                airport(name,country,description) 
            VALUES
                (?,?,?);
            `;
            conn.query(sql,[name,country,description], (err, result) => {
                conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
            })
        }
    })
},


// Endpoint 06 GET /airport/ -> "retrieve basically everything"
findAllAirport: function(callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            var sql = 
            `
            SELECT 
                airportid , name , country
            FROM
                airport
            `;
            conn.query(sql, (err, result) => {
                conn.end();
                if (err) {
                    console.log(err);
                    return callback(err, null);
                } else {
                    console.log(result);
                    return callback(null, result);
                }
            });
        }
    });
},







}