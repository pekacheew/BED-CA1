var db = require('./databaseConfig.js');

module.exports = {

// Endpoint 09 POST /booking/:userid/:flightid/ "INSERT new booking data into the database"
// Adds a new booking for a flight. A flight can have many bookings by a user. 
insertBooking: function(name , passport , nationality , age , userid , flightid, callback) {
    var conn = db.getConnection();
    conn.connect(function (err){
        if (err) {
            console.log(err)
            return callback(err, null);
             
        } else {
            var sql = 
            `
            INSERT INTO 
                booking(name , passport , nationality , age , userid , flightid) 
            VALUES
                (?,?,?,?,?,?);
            `;
            conn.query(sql,[name , passport , nationality , age , userid , flightid], (err, result) => {
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


}


 