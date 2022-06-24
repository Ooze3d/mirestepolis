const express = require('express');
const cors = require('cors');
const campusRoutes = require('./routes/campus');
const monitoresRoutes = require('./routes/monitores');
const nominasRoutes = require('./routes/nominas');
const usuariosRoutes = require('./routes/usuarios');
const actividadesRoutes = require('./routes/actividades');
const inscripcionesRoutes = require('./routes/inscripciones');
const app = express(); //Loading ExpressJS module

app.use(cors()); //Substitute of the previous set of headers to avoid cors problems

app.use(express.json()); //Express module to export results in JSON format

//The backend is divided in routes matching each service in the frontend

app.use('/api/campus', campusRoutes);
app.use('/api/monitores', monitoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/nominas', nominasRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);

module.exports = app;