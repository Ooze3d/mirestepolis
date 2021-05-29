const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');

router.get('/campus/:idcampus/:date', (req, res, next) => {
    let idcampus = req.params.idcampus;
    let fecha = req.params.date;
    con.query("SELECT actividades.* FROM actividades, grupos WHERE grupos.idcampus=? AND DATE_FORMAT(fechaini, '%Y-%m-%d')=? AND actividades.idgrupo=grupos.idgrupo", [idcampus, fecha], function (error, results) { //No es una N:M corriente
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

router.get('/:idactividad', checkAuth, (req, res, next) => {
    let dni = req.params.dni;
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

router.post('/new', checkAuth, (req, res, next) => {
    con.query('SELECT idactividad FROM actividades WHERE idgrupo=? AND ((fechaini>=? AND fechaini<?) OR (fechafin>? AND fechafin<=?))', [req.body.idgrupo, req.body.fechaini, req.body.fechafin, req.body.fechaini, req.body.fechafin], function(error, results) {
        if(error) {
            res.status(400).json({
                error: error
            });
        } else if(results.length!=0) {
            res.status(400).json({ //Si hay resultados, la actividad está pisando grupo y horas
                message: 'La actividad está solapada con otra previa. Por favor, comprueba los datos.'
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
                message: 'Actividad registered'
            });
        }
    });
});

router.put('/update/:idactividad', checkAuth, (req, res, next) => {
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

router.delete('/delete/:idactividad', checkAuth, (req, res, next) => {
    let idactividad = req.params.idactividad;
    con.query('DELETE FROM actividades WHERE idactividad=?', [idactividad], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Actividad deleted'
            });
        }
    });
});

module.exports = router;