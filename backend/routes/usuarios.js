const express = require("express");
const router = express.Router(); //Needed to separate each service in routes
const con = require('../mysql');
const bcrypt = require('bcrypt'); //This module is needed to hash the incoming password
const jwt = require('jsonwebtoken'); //This module generates the security token
const checkAuth = require('../middleware/check-auth');

const jwt_secret = '2A24DA7BEC36D3C20B8902B818E1E9972C9A1489881D08C52AF56A1A3FFF26B9'; //Secret word to generate the security token

//Get all users
router.get('',checkAuth, (req, res, next) => {
    con.query('SELECT * FROM usuarios', function (error, results) {
        if (error) {
            res.status(400).json({
                message: 'Error in database operation'
            });
        } else {
            res.json(results);
        }
    });
});


//Register new user
router.post('/signup', checkAuth, (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => { //Hash incoming password
        con.query('INSERT INTO usuarios(user, password, level) VALUES (?, ?, ?)', [req.body.user, hash, req.body.level], function (error, results) {
            if (error) throw error;
                console.log(results);
            res.status(200).json({
                message: 'User registered'
            });
        });
    });
});

//Login
router.post('/login', (req, res, next) => {
    con.query('SELECT * FROM usuarios WHERE user=?', [req.body.user], function (error, results) { //Checking for errors and valid user
        if (error) {
            res.status(400).send('Error in database operation');
        } else if (results.length == 0) {
            res.status(401).json({
                message: 'User not found'
            });
        } else { //If the user exists, we can compare the new hash with the one stored in the database
            bcrypt.compare(req.body.password, results[0].password, function (error, response) {
                if (error) {
                    res.status(401).json({
                        message: 'Password incorrect'
                    })
                } else {
                    jwt.sign({ user: results.user }, jwt_secret, { expiresIn: '1h' }, function (error, token) { //If the password is correct, a new security token is generated
                        if (error) throw error;
                        res.status(200).json({ //And sent to the frontend with an expiration time
                            token: token,
                            expiresIn: 3600 //Due to the time offset, we need to add two extra hours, but only the rest is valid
                        });
                    });
                }
            });
        }
    });
});

module.exports = router;