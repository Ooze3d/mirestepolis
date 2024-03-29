const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');

//List of activities by campus on a certain day
router.get('/campus/:idcampus/:date', (req, res, next) => {
    let idcampus = req.params.idcampus;
    let fecha = req.params.date;
    con.query("SELECT actividades.* FROM actividades, grupos WHERE grupos.idcampus=? AND DATE_FORMAT(fechaini, '%Y-%m-%d')=? AND actividades.idgrupo=grupos.idgrupo", [idcampus, fecha], function (error, results) { 
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//List of activities by monitor on a certain day
router.get('/monitor/:dni/:date', (req, res, next) => {
    let dni = req.params.dni;
    let fecha = req.params.date;
    con.query("SELECT * FROM actividades WHERE dnimonitor=? AND DATE_FORMAT(fechaini, '%Y-%m-%d')=?", [dni, fecha], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//List of all activities, regardless of campus and date
router.get('/', (req, res, next) => {
    let keyword = req.params.keyword;
    con.query("SELECT * FROM actividades", [keyword], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//Activity info by ID
router.get('/:idactividad', checkAuth, (req, res, next) => {
    let idactividad = req.params.idactividad;
    con.query('SELECT * FROM actividades WHERE idactividad=?', [idactividad], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New activity
router.post('/new', checkAuth, (req, res, next) => {
    con.query('SELECT idactividad FROM actividades WHERE idgrupo=? AND ((fechaini>=? AND fechaini<?) OR (fechafin>? AND fechafin<=?))', [req.body.idgrupo, req.body.fechaini, req.body.fechafin, req.body.fechaini, req.body.fechafin], function(error, results) {
        if(error) {
            res.status(400).json({
                error: error
            });
        } else if(results.length!=0) {
            res.status(400).json({ //If this query gets results, the new activity is trying to be added on top of another
                error: 'La actividad está solapada con otra previa. Por favor, comprueba los datos.'
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('INSERT INTO actividades(idactividad, nombre, descripcion, fechaini, fechafin, color, idgrupo, dnimonitor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.body.idactividad, req.body.nombre, req.body.descripcion, req.body.fechaini, req.body.fechafin, req.body.color, req.body.idgrupo, req.body.dnimonitor], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡'+req.body.nombre+' añadida!'
            });
        }
    });
});

//Edit activity by ID
router.put('/update/:idactividad', checkAuth, (req, res, next) => {
    let idactividad = req.params.idactividad;
    con.query('SELECT idactividad FROM actividades WHERE idgrupo=? AND idactividad!=? AND ((fechaini>=? AND fechaini<?) OR (fechafin>? AND fechafin<=?))', [req.body.idgrupo, idactividad, req.body.fechaini, req.body.fechafin, req.body.fechaini, req.body.fechafin], function(error, results) {
        if(error) {
            res.status(400).json({
                error: error
            });
        } else if(results.length!=0) {
            res.status(400).json({ //If this query gets results, the new activity is trying to be added on top of another
                message: 'La actividad está solapada con otra previa. Por favor, comprueba los datos.'
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    let idactividad = req.params.idactividad;
    con.query('UPDATE actividades SET nombre=?, descripcion=?, fechaini=?, fechafin=?, color=?, idgrupo=?, dnimonitor=? WHERE idactividad=?', [req.body.nombre, req.body.descripcion, req.body.fechaini, req.body.fechafin, req.body.color, req.body.idgrupo, req.body.dnimonitor, idactividad], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡'+req.body.nombre+' editada!'
            });
        }
    });
});

//Delete activity by ID
router.delete('/delete/:idactividad', checkAuth, (req, res, next) => {
    let idactividad = req.params.idactividad;
    con.query('DELETE FROM actividades WHERE idactividad=?', [idactividad], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Actividad borrada!'
            });
        }
    });
});

module.exports = router;