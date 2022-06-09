var db = require('./databaseConfig.js');

module.exports = {


// Endpoint 12 GET /promotion/ -> "retrieve ALL discounts"
findAllPromo: function(callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            var sql = 
            `
            SELECT 
                *
            FROM
                promotion
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


// Endpoint 13 GET /promotion/:flightid -> "retrieve discounts by flightid"
findPromoByID: function(flightId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {//database connection gt issue!
            console.log(err);
            return callback(err, null);
        } else {
            var sql = 
            `
            SELECT 
                *
            FROM 
                promotion
            WHERE 
                flightid = ?;
            `;
            conn.query(sql, [flightId], (err, result) => {
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


// Endpoint 14 POST /promotion/:flightid -> "insert new discount by flightid"
insertPromo: function(promoCode , discount , promoperiod, flightid, callback) {
    var conn = db.getConnection();
    conn.connect(function (err){
        if (err) {
            console.log(err)
            return callback(err, null);
             
        } else {
            var sql = 
            `
            INSERT INTO 
                promotion(promoCode , discount , promoperiod, flightid) 
            VALUES
                (?,?,?,?);
            `;
            conn.query(sql,[promoCode , discount , promoperiod, flightid], (err, result) => {
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


// Endpoint 15 PUT /promotion/:promoid -> "update discount by promoid"
editPromo: function(promoCode , discount , promoperiod, promoId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            var sql =
            `
            UPDATE 
                promotion
            SET
                promoCode = ?,
                discount = ?,
                promoPeriod = ?
            WHERE 
                promoid = ?
            `;
            conn.query(sql, [promoCode , discount , promoperiod , promoId], (err, result) => {
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


// Endpoint 16 DELETE /promotion/:promoid -> "delete discount by promoid"
deletePromo: function (promoID, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err,null);

        } else {
            var sql = 
            `
            DELETE FROM
                promotion
            WHERE
                promoid = ?;
            `;
            conn.query(sql, [promoID], function (err, result){
                conn.end();
                if (err) {
                    console.log(err);
                    return callback(err,null);
                } else {
                    console.log(result);
                    return callback(null, result);
                }
            })
        }
    })
},


// Endpoint 17 GET /promotion/flight -> "retrieve all flight data after applying all promos to get cheapest possible flights for everything"
findAllCheapestFlight: function(callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            var sql = 
            `
            SELECT
                f.flightid,
                flightCode,
                a1.name AS originAirport,
                a2.name AS destinationAirport,
                embarkDate,
                travelTime,
                (CASE 
                when discount > '0' THEN (price - discount)
                ELSE f.price
                END) AS 'Price after discount'
            FROM flight f
            LEFT JOIN promotion p
                ON f.flightid = p.flightid
            JOIN airport a1
                ON originAirport = a1.airportid
            JOIN airport a2
                ON destinationAirport = a2.airportid
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
