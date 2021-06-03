const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');

//Family members

//List of all family members (automatic search for new subscriptions)
router.get('/fam', checkAuth, (req, res, next) => {
    con.query('SELECT * FROM familiares', function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//One family member by ID
router.get('/fam/:dni', checkAuth, (req, res, next) => {
    let dni = req.params.dni;
    con.query('SELECT * FROM familiares WHERE dni=?',[dni] , function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New family member
router.post('/fam/new/:matricula', checkAuth, (req, res, next) => {
    con.query('INSERT INTO familiares(dni, nombre, apellidos, telefono, email) VALUES (?, ?, ?, ?, ?)', [req.body.dni, req.body.nombre, req.body.apellidos, req.body.telefono, req.body.email], function (error, results) {
        if (error) {
            if(error.code=='ER_DUP_ENTRY') {
                res.status(400).json({
                    message: 'DUPLICADO'
                });
            } else {
                res.status(400).json({
                    error: error
                });
            }
        } else {
            next();
        }
    });
}, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('INSERT INTO peque_tiene_familiar(matricula, dnifamiliar, tipofam, esprincipal) VALUES (?, ?, ?, ?)', [matricula, req.body.dni, req.body.tipofam, req.body.esprincipal], function(error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Familiar registered'
            });
        }
    });
});

//Edit family member
router.put('/fam/update/:dni', checkAuth, (req, res, next) => {
    let dni = req.params.dni;
    con.query('UPDATE familiares SET nombre=?, apellidos=?, telefono=?, email=?, tipofam=? WHERE dni=?', [req.body.nombre, req.body.apellidos, req.body.telefono, req.body.email, req.body.tipofam, dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Familiar updated'
            });
        }
    });
});

//Children

//Get list of children by Campus ID
router.get('/:idcampus', checkAuth, (req, res, next) => {
    let idcampus = req.params.idcampus;
    con.query('SELECT p.* FROM peques p, peque_asiste_campus pac WHERE pac.idcampus=? AND p.matricula=pac.matricula',[idcampus] , function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New child
router.post('/new/:idcampus', checkAuth, (req, res, next) => {
    con.query('INSERT INTO peques(matricula, nombre, apellidos, fechanac, aulamat, comedor, postcom, idgrupo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.body.matricula, req.body.nombre, req.body.apellidos, req.body.fechanac, req.body.aulamat, req.body.comedor, req.body.postcom, req.body.idgrupo], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    let idcampus = req.params.idcampus;
    con.query('INSERT INTO peque_asiste_campus(matricula, idcampus) VALUES (?, ?)', [req.body.matricula, idcampus], function(error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: req.body.nombre+' se ha registrado con éxito!'
            });
        }
    });
});

//Delete monitor
router.delete('/delete/:dni', checkAuth, (req, res, next) => {
    let dni = req.params.dni;
    con.query('DELETE FROM monitores WHERE dni=?', [dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Monitor deleted'
            });
        }
    });
});

module.exports = router;