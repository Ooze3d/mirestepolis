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
    con.query('SELECT * FROM familiares WHERE dni=?', [dni], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//One family member by child ID
router.get('/fam/child/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT fam.*, ptf.tipofam, ptf.esprincipal FROM familiares fam, peque_tiene_familiar ptf WHERE ptf.matricula=? AND fam.dni=ptf.dnifamiliar', [matricula], function (error, results) {
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
            if (error.code == 'ER_DUP_ENTRY') { //If the family member is already registered, the info is updated
                con.query('UPDATE familiares SET nombre=?, apellidos=?, telefono=?, email=? WHERE dni=?', [req.body.nombre, req.body.apellidos, req.body.telefono, req.body.email, req.body.dni], function (error, results) {
                    if (error) {
                        res.status(400).json({
                            error: error
                        });
                    } else {
                        next();
                    }
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
    con.query('INSERT INTO peque_tiene_familiar(matricula, dnifamiliar, tipofam, esprincipal) VALUES (?, ?, ?, ?)', [matricula, req.body.dni, req.body.tipofam, req.body.esprincipal], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡' + req.body.nombre + ' registrado!'
            });
        }
    });
});

//Edit family member
router.put('/fam/update/:dni', checkAuth, (req, res, next) => {
    let dni = req.params.dni;
    con.query('UPDATE familiares SET nombre=?, apellidos=?, telefono=?, email=? WHERE dni=?', [req.body.nombre, req.body.apellidos, req.body.telefono, req.body.email, dni], function (error, results) {
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

//Children

//Get list of children by Campus ID
router.get('/:idcampus', checkAuth, (req, res, next) => {
    let idcampus = req.params.idcampus;
    con.query('SELECT p.* FROM peques p, peque_asiste_campus pac WHERE pac.idcampus=? AND p.matricula=pac.matricula', [idcampus], function (error, results) {
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
    con.query('INSERT INTO peques(matricula, nombre, apellidos, fechanac, pagada, regalada, idgrupo) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.matricula, req.body.nombre, req.body.apellidos, req.body.fechanac, req.body.pagada, req.body.regalada, req.body.idgrupo], function (error, results) {
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
    con.query('INSERT INTO peque_asiste_campus(matricula, idcampus) VALUES (?, ?)', [req.body.matricula, idcampus], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡' + req.body.nombre + ' se ha registrado con éxito!'
            });
        }
    });
});

//Allergies

//List of allergies
router.get('/allergies/all', checkAuth, (req, res, next) => {
    con.query('SELECT * FROM alergias', function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//List of allergies by ID
router.get('/allergies/child/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT a.* FROM alergias a, peque_tiene_alergia pta WHERE pta.matricula=? AND a.idalergia=pta.idalergia', [matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New allergy
router.post('/allergies/new', checkAuth, (req, res, next) => {
    con.query('INSERT INTO alergias(nombre, descripcion) VALUES (?,?)', [req.body[0], req.body[1]], function (error, results) {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') { //If it finds an allergy with the same name
                con.query('SELECT idalergia FROM alergias WHERE nombre=?',[req.body[0]], function (error, results) {
                    if (error) {
                        res.status(400).json({
                            error: error
                        });
                    } else {
                        res.locals.id = results[0].idalergia;
                        next();
                    }
                });
            } else {
                res.status(400).json({
                    error: error
                });
            }
        } else {
            res.locals.id = results.insertId; //Object to retrieve the new auto id
            next();
        }
    });
}, (req, res, next) => {
    con.query('INSERT INTO peque_tiene_alergia(matricula, idalergia) VALUES (?, ?)', [req.body[2], req.res.locals.id], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡' + req.body[0] + ' se ha registrado con éxito!'
            });
        }
    });
});

//Conditions

//List of conditions
router.get('/conditions/all', checkAuth, (req, res, next) => {
    con.query('SELECT * FROM trastornos', function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//List of consitions by ID
router.get('/conditions/child/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT t.* FROM trastornos t, peque_tiene_trastorno ptt WHERE ptt.matricula=? AND t.idtrastorno=ptt.idtrastorno', [matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New condition
router.post('/conditions/new', checkAuth, (req, res, next) => {
    con.query('INSERT INTO trastornos(nombre, descripcion) VALUES (?,?)',[req.body[0], req.body[1]], function (error, results) {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') { //If it finds a condition with the same name
                con.query('SELECT idtrastorno FROM trastornos WHERE nombre=?',[req.body[0]], function (error, results) {
                    if (error) {
                        res.status(400).json({
                            error: error
                        });
                    } else {
                        res.locals.id = results[0].idtrastorno;
                        next();
                    }
                });
            } else {
                res.status(400).json({
                    error: error
                });
            }
        } else {
            res.locals.id = results.insertId; //Object to retrieve the new auto id
            next();
        }
    });
}, (req, res, next) => {
    con.query('INSERT INTO peque_tiene_trastorno(matricula, idtrastorno) VALUES (?, ?)', [req.body[2], req.res.locals.id], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡' + req.body[0] + ' se ha registrado con éxito!'
            });
        }
    });
});

//Delete child
router.delete('/delete/:matricula', checkAuth, (req, res, next) => {
    con.query('DELETE FROM peque_tiene_familiar WHERE matricula=?', [req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM peque_tiene_alergia WHERE matricula=?', [req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM peque_tiene_trastorno WHERE matricula=?', [req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM peque_asiste_campus WHERE matricula=?', [req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM peques WHERE matricula=?', [req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
});

module.exports = router;