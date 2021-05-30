const express = require('express');
const cors = require('cors');
const campusRoutes = require('./routes/campus');
const monitoresRoutes = require('./routes/monitores');
const nominasRoutes = require('./routes/nominas');
const usuariosRoutes = require('./routes/usuarios');
const actividadesRoutes = require('./routes/actividades');
const app = express(); //Loading ExpressJS module

/*app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/

app.use(cors()); //Substitute of the previous set of headers to avoid cors problems

app.use(express.json());

//The backend is divided in routes matching each service in the frontend

app.use('/api/campus', campusRoutes);
app.use('/api/monitores', monitoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/nominas', nominasRoutes);
app.use('/api/actividades', actividadesRoutes);

module.exports = app;