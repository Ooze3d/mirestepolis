const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');

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
            res.status(200).json({
                message: 'Monitor registered'
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
                message: 'Monitor updated'
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