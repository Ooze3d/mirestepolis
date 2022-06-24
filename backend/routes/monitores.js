const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');
const bcrypt = require('bcrypt');

//List of monitors by campus
router.get('/campus/:idcampus', checkAuth, (req, res, next) => {
    let idcampus = req.params.idcampus;
    con.query('SELECT * FROM monitores WHERE idcampus=?', [idcampus], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//Monitor data by key (DNI)
router.get('/:dni', checkAuth, (req, res, next) => {
    let dni = req.params.dni;
    con.query('SELECT * FROM monitores WHERE dni=?', [dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New monitor
router.post('/new', checkAuth, (req, res, next) => {
    con.query('INSERT INTO monitores(dni, nombre, apellidos, telefono, email, especialidad, idcampus, idgrupo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.body.dni, req.body.nombre, req.body.apellidos, req.body.telefono, req.body.email, req.body.especialidad, req.body.idcampus, req.body.idgrupo], function (error, results) {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(400).json({
                    error: 'Ya existe un monitor con el mismo DNI. Por favor, comprueba los datos.'
                });
            } else {
                res.status(400).json({
                    error: error
                });
            }
        } else {
            res.status(200).json({
                message: '¡' + req.body.nombre + ' registrado!'
            });
        }
    });
});

//Edit monitor
router.put('/update/:dni', checkAuth, (req, res, next) => {
    con.query('UPDATE monitores SET nombre=?, apellidos=?, telefono=?, email=?, especialidad=?, idcampus=?, idgrupo=? WHERE dni=?', [req.body.nombre, req.body.apellidos, req.body.telefono, req.body.email, req.body.especialidad, req.body.idcampus, req.body.idgrupo, req.body.dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡' + req.body.nombre + ' editado!'
            });
        }
    });
});

//Edit password
router.put('/newpass/:user', checkAuth, (req, res, next) => {
    let user = req.params.user;
    bcrypt.hash(req.body[0], 10).then(hash => {
        con.query('UPDATE usuarios SET password=? WHERE user=?', [hash, user], function (error, results) {
            if (error) {
                res.status(400).json({
                    error: error
                });
            } else {
                res.status(200).json({
                    message: '¡Nueva contraseña registrada!'
                });
            }
        });
    });
});

//Delete monitor
router.delete('/delete/:dni', checkAuth, (req, res, next) => {
    con.query('DELETE FROM jornadas WHERE dnimonitor=?', [req.params.dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM actividades WHERE dnimonitor=?', [req.params.dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM usuarios WHERE user=?', [req.params.dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM monitores WHERE dni=?', [req.params.dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Monitor borrado!'
            });
        }
    });
});

module.exports = router;