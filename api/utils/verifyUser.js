import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: 'No autorizado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, '¡Acceso denegado!'));
        req.user = user;
        next();
    });


};