var express = require('express');
var multer = require('multer');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});

app.use(bodyParser.json());
app.use(urlencodedParser);

var user = require('../model/user')   
var airport = require('../model/airport')    
var flight = require('../model/flight')    
var booking = require('../model/booking')    
var promo = require('../model/promotion')    


////////////////////////////////////////////////////////// USERS /////////////////////////////////////////////////////////

// Endpoint 01 POST /users/ -> "INSERT new user data into the database"
app.post("/users/", (req, res) => { 
    var {username,email,contact,password,role,profile_pic_url} = req.body;

    user.insertUser(username,email,contact,password,role,profile_pic_url, (err, result) => {
        if (err) {
            console.log(err);
            if (err.errno == 1062){
                res.status(422).json({'Condition': 'The new username OR new email provided already exists.'})
            } else {
                res.status(500).json({'Condition': 'Unknown error'});   
            }
            
            return;
        } else {
            res.status(201).send("New user added successfully");
        }
    });
});

// Endpoint 02 GET /users/ -> "retrieve basically everything"
app.get("/users/", (req, res) => { // copied from Practical6 Pg6
    user.findAllUser((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            res.status(200).send(result);
        };
    });
});

// Endpoint 03 GET /user/:userid -> "retrieve user information using SPECIFIC ID"
app.get("/users/:id/", (req, res) => { 
    var userID = parseInt(req.params.id);

    if (isNaN(userID)) {
        res.status(400).send();
        return;
    } else {
        user.findUserByID(userID, (err, result) => {
            if (err) {
                res.status(500).json({'Condition': 'Unknown error'});
                return;
            } else if (result[0] === undefined) {
                res.status(404).send("No such user exists");
                return;
            } else {
                res.status(200).send(result);
            }
        });
    }
});

// Endpoint 04 PUT /user/:userid -> "UPDATE user information using SPECIFIC ID"
app.put("/users/:userid/", (req, res) => { // Copied from Practical6 Pg14
    var userID = parseInt(req.params.userid);
    var {username,email,contact,password,role,profile_pic_url} = req.body;

    if (isNaN(userID)) {
        res.status(400).send("Parameter entered is not a number.");
        return;

    } else {
        user.editUser(username,email,contact,password,role,profile_pic_url, userID, (err, result) => {

            if (err) {
                console.log(err);

                if (err.errno == 1062){
                    res.status(422).json({'Condition': 'The new username OR new email provided already exists.'})
                } else {
                    res.status(500).json({'Condition': 'Unknown error'});
                }

                // res.status(500).send("Some error");
                return;
            } else {
                if (result.affectedRows == 0){
                    res.status(200).send(`No such user exists for the id of <${userID}>`)
                } else {
                    res.status(204).send();
                }

                // res.status(200).send("Success!");

            }
        });
    }
});

////////////////////////////////////////////////////////// USERS /////////////////////////////////////////////////////////

////////////////////////////////////////////////////////// AIRPORT /////////////////////////////////////////////////////////

// Endpoint 05 POST /airport/ -> "INSERT new airport data into the database"
app.post("/airport/", (req, res) => { 
    var {name,country,description} = req.body;

    airport.insertAirport(name,country,description, (err, result) => {
        if (err) {
            console.log(err);
            if (err.errno == 1062){
                res.status(422).json({'Condition': 'The airport name provided already exists.'})
            } else {
                res.status(500).json({'Condition': 'Unknown error'});   
            }
            
            return;
        } else {
            res.status(204).send();
        }
    });
});

// Endpoint 06 GET /airport/ -> "retrieve basically everything"
app.get("/airport/", (req, res) => { 
    airport.findAllAirport((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            res.status(200).send(result);
        };
    });
});

////////////////////////////////////////////////////////// AIRPORT /////////////////////////////////////////////////////////

////////////////////////////////////////////////////////// FLIGHT /////////////////////////////////////////////////////////

// Endpoint 07 POST /flight/ "INSERT new flight data into the database"
app.post("/flight/", (req, res) => { 
    var {flightCode , aircraft , originAirport , destinationAirport , embarkDate , travelTime , price} = req.body;

    flight.insertFlight(flightCode , aircraft , originAirport , destinationAirport , embarkDate , travelTime , price,  (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});   
            
            return;
        } else {
            res.status(201).json({"flightid":`${result.insertId}`});
        }
    });
});


// Endpoint 08 GET /flightDirect/:originAirportId/:destinationAirportId
// Retrieves flight info of flights travelling from origin airport to destination airport. 

app.get('/flightDirect/:originAirportId/:destinationAirportId', function (req, res){
    var ogAirport = parseInt(req.params.originAirportId)
    var dstAirport = parseInt(req.params.destinationAirportId)

    flight.getFlightDirect(ogAirport,dstAirport, function (err, result){
        if (err) {
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            // if (result[0] == undefined){
            //     res.status(200).send(`No such friend exist for id <${userid}>`)
            // } else {
            
            res.status(200).send(result);
            // }
            
        }
    })
})

// Endpoint 10 DELETE /flight/:id -> "DELETE flight data from the database"
app.delete('/flight/:id', function (req, res) {
    var flightid = parseInt(req.params.id);

    flight.deleteFlight(flightid, function (err, result) {
        if (err){
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            if (result.affectedRows == 0){
                res.status(200).send(`No such flight exists for the id of <${flightid}>`)
            } else {
                res.status(200).json({"Message": "Deletion successful"});
            }
            
        }
    });
});


//Endpoint 11: GET /transfer/flight/:originAirportId/:destinationAirportId
//Retrieves data of all flights from origin airport to destination airport with 1 transfer

app.get('/transfer/flight/:originAirportId/:destinationAirportId', function (req, res){
    var ogAirport = parseInt(req.params.originAirportId)
    var dstAirport = parseInt(req.params.destinationAirportId)

    flight.getTransferFlight(ogAirport,dstAirport, function (err, result){
        if (err) {
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            // if (result[0] == undefined){
            //     res.status(200).send(`No such friend exist for id <${userid}>`)
            // } else {
            
            res.status(201).send(result);
            // }
            
        }
    })
})

////////////////////////////////////////////////////////// FLIGHT /////////////////////////////////////////////////////////

////////////////////////////////////////////////////////// BOOKING /////////////////////////////////////////////////////////

// Endpoint 09 POST /booking/:userid/:flightid/ "INSERT new booking data into the database"
// Adds a new booking for a flight. A flight can have many bookings by a user. 
app.post("/booking/:userid/:flightid/", (req, res) => { 
    var userid = parseInt(req.params.userid)
    var flightid = parseInt(req.params.flightid)
    var {name , passport , nationality , age} = req.body;

    booking.insertBooking(name , passport , nationality , age , userid , flightid,  (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});   
            
            return;
        } else {
            res.status(201).json({"bookingid":`${result.insertId}`});
        }
    });
});

////////////////////////////////////////////////////////// BOOKING /////////////////////////////////////////////////////////

////////////////////////////////////////////////////////// PROMO /////////////////////////////////////////////////////////

// Endpoint 12 GET /promotion/ -> "retrieve ALL discounts"
app.get("/promotion/", (req, res) => { // copied from Practical6 Pg6
    promo.findAllPromo((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            res.status(200).send(result);
        };
    });
});

// Endpoint 13 GET /promotion/:flightid -> "retrieve discounts by flightid"
app.get("/promotion/:flightid", (req, res) => { 
    var flightID = parseInt(req.params.flightid);

    if (isNaN(flightID)) {
        res.status(400).send();
        return;
    } else {
        promo.findPromoByID(flightID, (err, result) => {
            if (err) {
                res.status(500).json({'Condition': 'Unknown error'});
                return;
            } else if (result === null) {
                res.status(404).send("No such flight exists");
                return;
            } else {
                res.status(200).send(result);
            }
        });
    }
});


// Endpoint 14 POST /promotion/:flightid -> "insert new discount by flightid"
app.post("/promotion/:flightid", (req, res) => { // copied from Practical6 Pg12
    var flightid = req.params.flightid
    var {promoCode , discount , promoPeriod} = req.body;

    promo.insertPromo(promoCode , discount , promoPeriod, flightid, (err, result) => {
        if (err) {
            console.log(err);
            if (err.errno == 1062){
                res.status(500).send("Promo already exists")
            } else {
                res.status(500).json({'Condition': 'Unknown error'});
            }
            
            return;
        } else {
            res.status(201).send(`New promo <${promoCode}> added successfully`);
        }
    });
});


// Endpoint 15 PUT /promotion/:promoid -> "update discount by promoid"
app.put("/promotion/:promoId", (req, res) => { // Copied from Practical6 Pg14
    var promoID = parseInt(req.params.promoId);
    var {promoCode , discount , promoPeriod} = req.body;

    if (isNaN(promoID)) {
        res.status(400).send("Parameter entered is not a number.");
        return;

    } else {
        promo.editPromo(promoCode , discount , promoPeriod, promoID, (err, result) => {

            if (err) {
                console.log(err);

                if (err.errno == 1062){
                    res.status(500).send("Promo already exists")
                } else {
                    res.status(500).json({'Condition': 'Unknown error'});
                }

                // res.status(500).send("Some error");
                return;
            } else {
                if (result.affectedRows == 0){
                    res.status(200).send(`No such promo exists for the id of <${promoID}>`)
                } else {
                    res.status(200).send(`Successfully updated the promotion of <${promoCode}>!`);
                }

                // res.status(200).send("Success!");

            }
        });
    }
});


// Endpoint 16 DELETE /promotion/:promoid -> "delete discount by promoid"
app.delete('/promotion/:promoid', function (req, res) {
    var promoId = parseInt(req.params.promoid);

    promo.deletePromo(promoId, function (err, result) {
        if (err){
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            if (result.affectedRows == 0){
                res.status(200).send(`No such promo exists for the id of <${promoId}>`)
            } else {
                res.status(200).send(result.affectedRows+' row(s) of result deleted');
            }
            
        }
    });
});


// Endpoint 17 GET /cheapestFlights -> "retrieve all flight data after applying all promos to get cheapest possible flights for everything"
app.get("/cheapestFlights", (req, res) => { 
    promo.findAllCheapestFlight((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({'Condition': 'Unknown error'});
        } else {
            res.status(200).send(result);
        };
    });
});
////////////////////////////////////////////////////////// PROMO /////////////////////////////////////////////////////////

////////////////////////////////////////////////////////// IMAGE /////////////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination:'./image/',
    filename:(req,file,callback) => {
        return callback(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    },
})

const imageFilter = (req, file, callback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        callback(null, true);
    } else {
        // callback(new Error("Unsupported file received"), false);
        return callback('Error: only can have images with .jpg or .png extension')
    }
};

const upload = multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter: imageFilter
})

// Endpoint 18: POST /users/:id/photo 
app.post("/users/:id/photo",upload.single('photo'),function(req,res){
    var userid = req.params.id;
    var imgPath = req.file.filename;

    user.insertPhoto(imgPath, userid, function(err,result){
        if (err){
            res.status(500).json({"Result":"Internal Error"})
        } else {
            res.status(200).json({"Image URL":`http://localhost:8081/users/${userid}/photo`})
        }
    })
})

// Endpoint 19: GET /users/:id/photo
app.get("/users/:id/photo", function(req, res){
    var userid = req.params.id;
    user.findPhotoById(userid,function(err,result){
        if(err){
            res.status(500).json({Result:"Internal Error"})
        } else {
            res.status(200).json({"Image URL":`http://localhost:8081/${userid}/photo/${result[0].profile_pic_url}`})
        }
    })
})

////////////////////////////////////////////////////////// IMAGE /////////////////////////////////////////////////////////


module.exports = app




 

