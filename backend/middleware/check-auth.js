//A new middleware is necessary in order to protect a number of routes in the API REST, preventing unauthorised users from using them
const jwt = require('jsonwebtoken');

const jwt_secret = '2A24DA7BEC36D3C20B8902B818E1E9972C9A1489881D08C52AF56A1A3FFF26B9';

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //All requests must include a security token as part of the header, otherwise they won't work
        jwt.verify(token, jwt_secret); 
        next();
    } catch (error) {
        res.status(401).json({
            message: 'You shall not pass'
        });
    }
};