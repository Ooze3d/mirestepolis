const express = require('express');
const cors = require('cors');
const campusRoutes = require('./routes/campus');
const monitoresRoutes = require('./routes/monitores');
const nominasRoutes = require('./routes/nominas');
const usuariosRoutes = require('./routes/usuarios');
const actividadesRoutes = require('./routes/actividades');
const app = express();

/*app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/

app.use(cors());

app.use(express.json());

app.use('/api/campus', campusRoutes);
app.use('/api/monitores', monitoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/nominas', nominasRoutes);
app.use('/api/actividades', actividadesRoutes);

module.exports = app;