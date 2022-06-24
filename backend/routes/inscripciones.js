const express = require("express");
const router = express.Router();
const con = require('../mysql');
const checkAuth = require('../middleware/check-auth');
//const { consoleTestResultHandler } = require("tslint/lib/test");

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

//One family member by TLF
router.get('/fam/:tlf', checkAuth, (req, res, next) => {
    let tlf = req.params.tlf;
    con.query('SELECT * FROM familiares WHERE tlf=?', [tlf], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//Family members by child ID
router.get('/fam/child/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT fam.*, ptf.tipofam, ptf.esprincipal FROM familiares fam, peque_tiene_familiar ptf WHERE ptf.matricula=? AND fam.tlf=ptf.tlffamiliar', [matricula], function (error, results) {
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
    try {
        con.query('INSERT INTO familiares(tlf, nombre, apellidos, email) VALUES (?, ?, ?, ?)', [req.body.tlf, req.body.nombre, req.body.apellidos, req.body.email], function (error, results) {
            if (error) {
                if (error.code == 'ER_DUP_ENTRY') { //If the family member is already registered, the info is updated
                    con.query('UPDATE familiares SET nombre=?, apellidos=?, email=? WHERE tlf=?', [req.body.nombre, req.body.apellidos, req.body.email, req.body.tlf], function (error, results) {
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
    } catch (err) {

    }
}, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('INSERT INTO peque_tiene_familiar(matricula, tlffamiliar, tipofam, esprincipal) VALUES (?, ?, ?, ?)', [matricula, req.body.tlf, req.body.tipofam, req.body.esprincipal], function (error, results) {
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
router.put('/fam/update/:tlf', checkAuth, (req, res, next) => {
    let tlf = req.params.tlf;
    con.query('UPDATE familiares SET nombre=?, apellidos=?, email=? WHERE tlf=?', [req.body.nombre, req.body.apellidos, req.body.email, tlf], function (error, results) {
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
router.get('/all/:idcampus', checkAuth, (req, res, next) => {
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

//Get child by ID
router.get('/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT p.* FROM peques p WHERE p.matricula=?', [matricula], function (error, results) {
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

//Edit child
router.put('/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('UPDATE peques SET nombre=?, apellidos=?, fechanac=?, pagada=?, regalada=?, idgrupo=? WHERE matricula=?', [req.body.nombre, req.body.apellidos, req.body.fechanac, req.body.pagada, req.body.regalada, req.body.idgrupo, matricula], function (error, results) {
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

//Days

//List of paid days by child ID
router.get('/dayspaid/per/child/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT * FROM pagos WHERE matricula=?', [matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//List of days by child ID
router.get('/check/list/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT * FROM paselista WHERE matricula=?', [matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});

//New paid day by child ID
router.post('/days/newpaid', checkAuth, (req, res, next) => {
    con.query('INSERT INTO pagos(fecha, matricula, aulamat, comedor, postcom) VALUES (?, ?, ?, ?, ?)', [req.body.fecha, req.body.matricula, req.body.aulamat, req.body.comedor, req.body.postcom], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Día registrado'
            });
        }
    });
});

//Delete paid day
router.delete('/dayspaid/:matricula/:fecha', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    let fecha = req.params.fecha;
    con.query("DELETE FROM pagos WHERE matricula=? AND DATE_FORMAT(fecha, '%Y-%m-%d')=?", [matricula, fecha], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json({
                message: 'Día borrado'
            });
        }
    });
});

//New complete day by child ID
router.post('/days/newday', checkAuth, (req, res, next) => {
    con.query('INSERT INTO paselista(fecha, matricula, aulamat, comedor, postcom, entrada, salida, tlffamiliar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.body.fecha, req.body.matricula, req.body.aulamat, req.body.comedor, req.body.postcom, req.body.entrada, req.body.salida, req.body.tlffamiliar], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: 'Día registrado'
            });
        }
    });
});

//New check in by child ID
router.post('/days/checkin', checkAuth, (req, res, next) => {
    con.query("INSERT INTO paselista(fecha, matricula, entrada) VALUES (?, ?, 1)", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Entrada registrada!'
            });
        }
    });
});

//Delete check in by child ID and date
router.delete('/days/checkin/:fecha/:matricula', checkAuth, (req, res, next) => {
    con.query("DELETE FROM paselista WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.params.fecha, req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Entrada borrada!'
            });
        }
    });
});

//New daycare in by child ID
router.put('/days/daycare', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET aulamat=1 WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Aula matinal registrada!'
            });
        }
    });
});

//Delete daycare by child ID and date
router.put('/days/deletedaycare', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET aulamat=0 WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Aula matinal borrada!'
            });
        }
    });
});

//New meal in by child ID
router.put('/days/meal', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET comedor=1 WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Comedor registrado!'
            });
        }
    });
});

//Delete meal by child ID and date
router.put('/days/deletemeal', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET comedor=0 WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Comedor borrado!'
            });
        }
    });
});

//New postmeal in by child ID
router.put('/days/postmeal', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET postcom=1 WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Campus wait registrado!'
            });
        }
    });
});

//Delete postmeal by child ID and date
router.put('/days/deletepostmeal', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET postcom=0 WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Campus wait borrado!'
            });
        }
    });
});

//New check out by child ID
router.put('/days/checkout', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET salida=1, tlffamiliar=? WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.tlffamiliar, req.body.fecha, req.body.matricula], function (error, results) {
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

//Delete check in by child ID and date
router.put('/days/deletecheckout', checkAuth, (req, res, next) => {
    con.query("UPDATE paselista SET salida=0, tlffamiliar=NULL WHERE DATE_FORMAT(fecha, '%Y-%m-%d')=? AND matricula=?", [req.body.fecha, req.body.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                message: '¡Salida borrada!'
            });
        }
    });
});
/*
//List of months by child ID (NOT NEEDED ANYMORE - ADD TO CAMPUS)
router.get('/months/:matricula', checkAuth, (req, res, next) => {
    let matricula = req.params.matricula;
    con.query('SELECT DISTINCT MONTH(fecha) as numero, MONTHNAME(fecha) as texto FROM pagos WHERE matricula=?', [matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
});*/

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
                con.query('SELECT idalergia FROM alergias WHERE nombre=?', [req.body[0]], function (error, results) {
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
    con.query('INSERT INTO trastornos(nombre, descripcion) VALUES (?,?)', [req.body[0], req.body[1]], function (error, results) {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') { //If it finds a condition with the same name
                con.query('SELECT idtrastorno FROM trastornos WHERE nombre=?', [req.body[0]], function (error, results) {
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

router.get('check/:matricula', checkAuth, (req, res, next) => {
    con.query('SELECT * FROM peques WHERE matricula=?', [req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            if (results.lenght > 0)
                res.status(200).json({
                    message: 'true'
                });
            else
                res.status(200).json({
                    message: 'false'
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
    con.query('DELETE FROM pagos WHERE matricula=?', [req.params.matricula], function (error, results) {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            next();
        }
    });
}, (req, res, next) => {
    con.query('DELETE FROM paselista WHERE matricula=?', [req.params.matricula], function (error, results) {
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
            res.status(200).json({
                message: '¡Inscripción borrada!'
            });
        }
    });
});

module.exports = router;