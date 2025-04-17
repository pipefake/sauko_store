const { decode } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//verificación del token con JWT

const verifyToken = async (req, res, next) => {
    const jwtPassword = process.env.JWT_SECRET;

    const authHeader = req.headers['authorization'];
    // console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({
            mensaje: 'No estás autorizado'
        });
    }
    const token = authHeader;
    if (!token || token == 'null') {
        return res.json({
            mensaje: 'No estás autorizado Null'
        });
    }
    jwt.verify(token, jwtPassword, (error, decoded) => {
        if (error) return res.status(401).json({
            mensaje: 'El token no es válido o ha expirado'
        });
        // console.log(decoded);
        req.user = decoded;
        next();

    }
    );
}

//verificación del rol (1) administrador
const verifyAuthorization = async (req, res, next) => {
    // Obtener rol
    const { rol } = req.user;

    // Verificar si el rol es 1 (administrador)
    if (rol != 1 || !rol || rol == 'null') {
        return res.status(403).json({ mensaje: 'No tienes permiso para acceder a esta ruta' });
    }

    next();
}
module.exports = {
    verifyToken,
    verifyAuthorization
};