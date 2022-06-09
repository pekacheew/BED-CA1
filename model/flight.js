var db = require('./databaseConfig.js');

module.exports = {

// Endpoint 07 POST /flight/ -> "INSERT new user data into the database"
insertFlight: function(flightCode , aircraft , originAirport , destinationAirport , embarkDate , travelTime , price, callback) {
    var conn = db.getConnection();
    conn.connect(function (err){
        if (err) {
            console.log(err)
            return callback(err, null);
             
        } else {
            var sql = 
            `
            INSERT INTO 
                flight(flightCode , aircraft , originAirport , destinationAirport , embarkDate , travelTime , price) 
            VALUES
                (?,?,?,?,?,?,?);
            `;
            conn.query(sql,[flightCode , aircraft , originAirport , destinationAirport , embarkDate , travelTime , price], (err, result) => {
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

// Endpoint 08 GET /flightDirect/:originAirportId/:destinationAirportId
// Retrieves flight info of flights travelling from origin airport to destination airport. 
getFlightDirect(ogAirport,dstAirport, callback){

    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err,null);

        } else {
            // var sql = 'SELECT * FROM user WHERE userid = ?';
            var sql = 
            `
            SELECT
                f1.flightid ,
                f1.flightCode ,
                f1.aircraft ,
                a1.name AS originAirport ,
                a2.name AS destinationAirport ,
                f1.embarkDate , f1.travelTime ,
                f1.price
            FROM 
                airport a1 ,
                airport a2 ,
                flight f1
            WHERE
                originAirport = a1.airportid AND
                destinationAirport = a2.airportid AND
                originAirport = ? AND
                destinationAirport = ?
            ORDER BY
                f1.flightid ASC
    

            `; // change sql statement according to question
            conn.query(sql, [ogAirport,dstAirport], function (err, result) {          // userid here is a reference from line 4 function parameter
                conn.end();
                if (err) {
                    console.log(err);
                    return callback(err,null);
                } else {
                    console.log(result);
                    return callback(null, result);
                }
            });
        }
    });
},

// Endpoint 10 DELETE /flight/:id -> "DELETE flight data from the database"
deleteFlight: function (flightID, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err,null);

        } else {
            var sql = 
            `
            DELETE FROM
                flight
            WHERE
                flightid = ?;
            `;
            // var sql2 =
            // `
            // DELETE FROM
            //     booking
            // WHERE
            //     flightid = ?
            // `
            conn.query(sql, [flightID], function (err1, result){
                // conn.query(sql2, [flightID] , function(err2,result2){
                    conn.end();
                    if (err1) {
                        console.log(err1);
                        return callback(err1,null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    } 
                // })
                
            })
        }
    })
},


//Endpoint 11: GET /transfer/flight/:originAirportId/:destinationAirportId
//Retrieves data of all flights from origin airport to destination airport with 1 transfer
getTransferFlight(ogAirport,dstAirport, callback){

    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err,null);

        } else {
            var sql = 
            `
            SELECT
                f1.flightid AS firstFlightId,
                f2.flightid AS secondFlightId, 
                f1.flightCode AS flightCode1,
                f2.flightCode as flightCode2,
                f1.aircraft AS aircraft1,
                f2.aircraft AS aircraft2,
                a1.name AS originAirport,
                a3.name AS transferAirport,
                a2.name AS destinationAirport,
                (f1.price + f2.price) AS 'Total price'
            FROM
                flight f1,
                flight f2,
                airport a1,
                airport a2,
                airport a3
            WHERE
                f1.destinationAirport = f2.originAirport AND
                f1.originAirport = a1.airportid AND
                f2.destinationAirport = a2.airportid AND
                f1.destinationAirport = a3.airportid AND
                f1.originAirport = ? AND
                f2.destinationAirport = ?
    

            `; // change sql statement according to question
            conn.query(sql, [ogAirport,dstAirport], function (err, result) {          // userid here is a reference from line 4 function parameter
                conn.end();
                if (err) {
                    console.log(err);
                    return callback(err,null);
                } else {
                    console.log(result);
                    return callback(null, result);
                }
            });
        }
    });
},






}