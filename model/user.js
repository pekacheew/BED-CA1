var db = require('./databaseConfig.js');

module.exports = {

// Endpoint 01 POST /users/ -> "INSERT new user data into the database"
insertUser: function(username,email,contact,password,role,profile_pic_url, callback) {
    var conn = db.getConnection();
    conn.connect(function (err){
        if (err) {
            console.log(err)
            return callback(err, null);
             
        } else {
            var sql = 
            `
            INSERT INTO 
                users(username,email,contact,password,role,profile_pic_url) 
            VALUES
                (?,?,?,?,?,?);
            `;
            conn.query(sql,[username,email,contact,password,role,profile_pic_url], (err, result) => {
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

// Endpoint 02 GET /users/ -> "retrieve basically everything"
findAllUser: function(callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            var sql = 
            `
            SELECT 
                userid , username , email , contact , role , profile_pic_url , created_at
            FROM
                users
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

// Endpoint 03 GET /users/:userid -> "retrieve user information using SPECIFIC ID"
findUserByID: function(userID, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {//database connection gt issue!
            console.log(err);
            return callback(err, null);
        } else {
            var sql = 
            `
            SELECT 
                userid , username , email , contact , role , profile_pic_url , created_at
            FROM 
                users 
            WHERE 
                userid = ?;
            `;
            conn.query(sql, [userID], (err, result) => {
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

// Endpoint 04 PUT /user/:userid -> "UPDATE user information using SPECIFIC ID"
editUser: function(username,email,contact,password,role,profile_pic_url, userID, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {//database connection gt issue!
            console.log(err);
            return callback(err, null);
        } else {
            var sql =
            `
            UPDATE 
                users
            SET
                username = ?,
                email = ?,
                contact = ?,
                password = ?,
                role = ?,
                profile_pic_url = ?
            WHERE 
                userid = ?
            `;
            conn.query(sql, [username,email,contact,password,role,profile_pic_url, userID], (err, result) => {
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



////////////////////////////////////////////////////////// IMAGE /////////////////////////////////////////////////////////

insertPhoto: function(photoPath, userid, callback) {
    var conn = db.getConnection();
    conn.connect(function(err) {
        if (err) {
            return callback(err, null);
        } else {
            var sql = "UPDATE users SET profile_pic_url = ? WHERE userid = ?";
            conn.query(sql, [photoPath, userid], (err, result) => {
                conn.end();
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, result);
                }
            });
        }
    });
},

findPhotoById: function(userid, callback) {
    var conn = db.getConnection();
    conn.connect(function(err) {
        if (err) {
            return callback(err, null);
        } else {
            const sql = "SELECT profile_pic_url FROM users WHERE userid = ?";
            conn.query(sql, [userid], (err, result) => {
                conn.end();
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, result);
                }
            });
        }
    });
},


}