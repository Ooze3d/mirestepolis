const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');

router.get('/jornadas/:dnimonitor', checkAuth, (req, res, next) => { //Listado de jornadas del monitor
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

router.get('/jornadas/:dnimonitor/:year/:month', (req, res, next) => { //Nómina de un mes
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

router.get('/:dnimonitor', (req, res, next) => { //Listado de meses trabajados
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

router.post('/jornadas/new', checkAuth, (req, res, next) => { //Administrador registra un día completo
    con.query('INSERT INTO jornadas(fecha, horaent, horasal, dnimonitor) VALUES (?, ?, ?, ?)', [req.body.fecha, req.body.horaent, req.body.horasal, req.body.dnimonitor], function (error, results) {
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
                message: 'Day registered'
            });
        }
    });
});

router.post('jornadas/newentrada', checkAuth, (req, res, next) => { //Botón entrada
    con.query('INSERT INTO jornadas(fecha, horaent, dnimonitor) VALUES (?, ?, ?)', [req.body.fecha, req.body.horaent, req.body.dnimonitor], function (error, results) {
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
                message: 'Start registered'
            });
        }
    });
});

router.put('/jornadas/newsalida', checkAuth, (req, res, next) => { //Botón salida
    con.query('UPDATE jornadas SET horasal=? WHERE fecha=? AND dnimonitor=?', [req.body.horasal, req.body.fecha, req.body.dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Exit registered'
            });
        }
    });
});

router.put('/jornadas', checkAuth, (req, res, next) => { //Editar una jornada
    let fecha = req.body.fecha.substr(0,10);
    con.query('UPDATE jornadas SET horaent=?, horasal=? WHERE fecha=? AND dnimonitor=?', [req.body.horaent, req.body.horasal, fecha, req.body.dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                res: results,
                message: 'Day edited'
            });
        }
    });
});

router.delete('/jornadas/delete/:fecha/:dnimonitor', checkAuth, (req, res, next) => {
    con.query('DELETE FROM jornadas WHERE fecha=? AND dnimonitor=?', [req.params.fecha, req.params.dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Day deleted'
            });
        }
    });
});

module.exports = router;