const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');

//List of all campus
router.get('', checkAuth, (req, res, next) => {
    con.query('SELECT * FROM campus', function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//Campus info by ID
router.get('/:idcampus', checkAuth, (req, res, next) => { 
    let idcampus = req.params.idcampus;
    con.query('SELECT * FROM campus WHERE idcampus=?', [idcampus], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//List of groups by campus
router.get('/grupos/:idcampus', (req, res, next) => {
    let idcampus = req.params.idcampus;
    con.query('SELECT idgrupo, nombre FROM grupos WHERE idcampus=? ORDER BY posicion', idcampus, function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New campus
router.post('/new', checkAuth, (req, res, next) => {
    let idcampus = req.body.idcampus;
    let desc = ['Infantil (3-4-5-6)', 'Grupo 1 (6-7-8)', 'Grupo 2 (9-10)', 'Grupo 3 (11-12-13)'];
    let extra = ['_inf', '_gr1', '_gr2', '_gr3'];
    let myQuery = '';
    for(let i=0;i<4;i++) {
        myQuery += 'INSERT INTO grupos(idgrupo, posicion, nombre, descripcion, idcampus) VALUES ("'+idcampus+extra[i]+'", "'+(i+1)+'", "'+desc[i]+'", "'+desc[i]+' del campus '+idcampus+'", "'+idcampus+'");';
    }
    con.query('INSERT INTO campus(idcampus, nombre, direccion, fechaini, fechafin) VALUES (?, ?, ?, ?, ?);'+myQuery+'', [req.body.idcampus, req.body.nombre, req.body.direccion, req.body.fechaini, req.body.fechafin], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else { 
            res.status(200).json({
                message: '¡'+req.body.nombre+' registrado!'
            });
        }
    });
});

//Edit campus by ID
router.put('/update/:idcampus', checkAuth, (req, res, next) => {
    con.query('UPDATE campus SET nombre=?, direccion=?, fechaini=?, fechafin=? WHERE idcampus=?', [req.body.nombre, req.body.direccion, req.body.fechaini, req.body.fechafin, req.body.idcampus], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡'+req.body.nombre+' editado!'
            });
        }
    });
});

//Delete campus by ID
router.delete('/delete/:idcampus', checkAuth, (req, res, next) => {
    let idcampus = req.params.idcampus;
    con.query('DELETE FROM grupos WHERE idcampus=?; DELETE FROM campus WHERE idcampus=?', [idcampus, idcampus], function(error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Campus borrado!'
            });
        }
    });
});

module.exports = router;