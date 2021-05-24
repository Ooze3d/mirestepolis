//Vamos a crear un middleware propio para proteger ciertas rutas del API REST y evitar que usuarios no autorizados las usen
const jwt = require('jsonwebtoken');

const jwt_secret = '2A24DA7BEC36D3C20B8902B818E1E9972C9A1489881D08C52AF56A1A3FFF26B9';

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Todas las peticiones deberán venir con un token en la cabecera, o si no, no funcionarán
        jwt.verify(token, jwt_secret);
        next();
    } catch (error) {
        res.status(401).json({
            message: 'You shall not pass'
        });
    }
};