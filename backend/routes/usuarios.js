const express = require("express");
const router = express.Router(); //Para poder separar las peticiones por secciones, rutas y archivos distintos
const con = require('../mysql');
const bcrypt = require('bcrypt'); //Para realizar el hash del password
const jwt = require('jsonwebtoken'); //Para generar el token de autorización
const checkAuth = require('../middleware/check-auth');

const jwt_secret = '2A24DA7BEC36D3C20B8902B818E1E9972C9A1489881D08C52AF56A1A3FFF26B9'; //Palabra clave para la generación del token de autorización

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


//Función de registro de nuevos usuarios
router.post('/signup', checkAuth, (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => { //Realizamos el hash del password que nos viene desde el formulario
        con.query('INSERT INTO usuarios(user, password, level) VALUES (?, ?, ?)', [req.body.user, hash, req.body.level], function (error, results) {
            if (error) throw error;
                console.log(results);
            res.status(200).json({
                message: 'User registered'
            });
        });
    });
});

//Función de login
router.post('/login', (req, res, next) => {
    con.query('SELECT * FROM usuarios WHERE user=?', [req.body.user], function (error, results) { //Vemos si no hay errores y si tenemos un usuario con ese nombre
        if (error) {
            res.status(400).send('Error in database operation');
        } else if (results.length == 0) {
            res.status(401).json({
                message: 'User not found'
            });
        } else { //Si el usuario existe, pasamos a comparar los hashes del password
            bcrypt.compare(req.body.password, results[0].password, function (error, response) {
                if (error) {
                    res.status(401).json({
                        message: 'Password incorrect'
                    })
                } else {
                    jwt.sign({ user: results.user }, jwt_secret, { expiresIn: '1h' }, function (error, token) { //Si el password es correcto, pasamos a generar un token
                        if (error) throw error;
                        res.status(200).json({ //Y lo enviamos al frontend
                            token: token,
                            expiresIn: 3600
                        });
                    });
                }
            });
        }
    });
});

module.exports = router;