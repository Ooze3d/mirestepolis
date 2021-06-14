const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');

//Full list of days worked
router.get('/jornadas/:dnimonitor', checkAuth, (req, res, next) => {
    let dnimonitor = req.params.dnimonitor;
    con.query('SELECT * FROM jornadas WHERE dnimonitor=?', [dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//List of days worked by moth
router.get('/jornadas/:dnimonitor/:year/:month', (req, res, next) => {
    let dnimonitor = req.params.dnimonitor;
    let year = req.params.year;
    let month = req.params.month;
    con.query('SELECT * FROM jornadas WHERE dnimonitor=? AND EXTRACT(YEAR FROM fecha)=? AND EXTRACT(MONTH FROM fecha)=?', [dnimonitor, year, month], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            console.log(results);
            res.json(results);
        }
    });
});

//List of months worked
router.get('/:dnimonitor', (req, res, next) => {
    let dnimonitor = req.params.dnimonitor;
    con.query("SELECT DISTINCT DATE_FORMAT(fecha, '%m/%Y') AS 'full' FROM jornadas WHERE dnimonitor=?", [dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New day worked, added by admin
router.post('/jornadas/new', checkAuth, (req, res, next) => {
    con.query('INSERT INTO jornadas(fecha, horaent, horasal, dnimonitor) VALUES (?, ?, ?, ?)', [req.body.fecha, req.body.horaent, req.body.horasal, req.body.dnimonitor], function (error, results) {
        if (error) {
            if(error.code=='ER_DUP_ENTRY') {
                res.status(400).json({
                    error: 'Ya existe un registro para este día. Por favor, comprueba los datos.'
                });
            } else {
                res.status(400).json({
                    error: error
                });
            }
        } else {
            res.status(200).json({
                message: '¡Día registrado!'
            });
        }
    });
});

//In time, enter button
router.post('/jornadas/entrada/new', checkAuth, (req, res, next) => {
    con.query('INSERT INTO jornadas(fecha, horaent, dnimonitor) VALUES (?, ?, ?)', [req.body.fecha, req.body.horaent, req.body.dnimonitor], function (error, results) {
        if (error) {
            if(error.code=='ER_DUP_ENTRY') {
                res.status(400).json({
                    error: 'Ya existe una entrada registrada para este día. Por favor, comprueba los datos.'
                });
            } else {
                res.status(400).json({
                    error: error
                });
            }
        } else {
            res.status(200).json({
                message: '¡Entrada registrada!'
            });
        }
    });
});

//Out time, exit button
router.put('/jornadas/salida/new', checkAuth, (req, res, next) => {
    con.query('UPDATE jornadas SET horasal=? WHERE fecha=DATE(?) AND dnimonitor=?', [req.body.horasal, req.body.fecha, req.body.dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Salida registrada!'
            });
        }
    });
});

//Edit a day
router.put('/jornadas', checkAuth, (req, res, next) => {
    let fecha = req.body.fecha.substr(0,10);
    con.query('UPDATE jornadas SET horaent=?, horasal=? WHERE fecha=? AND dnimonitor=?', [req.body.horaent, req.body.horasal, fecha, req.body.dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                res: results,
                message: '¡Día editado!'
            });
        }
    });
});

//Delete a day
router.delete('/jornadas/delete/:fecha/:dnimonitor', checkAuth, (req, res, next) => {
    con.query('DELETE FROM jornadas WHERE fecha=? AND dnimonitor=?', [req.params.fecha, req.params.dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Día borrado!'
            });
        }
    });
});

module.exports = router;