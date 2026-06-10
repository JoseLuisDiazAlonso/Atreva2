/**Creamos un archivo que compruebe si el token existe en la tabla Sesion */

const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

async function verifyToken (req, res, next) {
    //Leemos el header de autorización
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({message: 'Token no proporcionado'});
    }

    //Separamos Bearer del token
    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({message: 'Formato de token inválido'});
    }

    const token = partes[1];

    //verificamos la firma criptográfica del token
    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        if (error.name === 'TokenExpiredError') {
            //Si el token expiró, limpiamos tamibén su registro en BD
            await prisma.sesion.deleteMany ({
                where: {token},
            });
            return res.status(401).json({message: 'Sesión expirada. Por favor, inicia sesión de nuevo.'});
        }
        return res.status(401).json({message: 'Token inválido'});
    }
    //Comprobamos que la sesión existe en BD (no se ha hecho logout)
    const sesion = await prisma.sesion.findUnique ({
        where: {token},
    });

    if (!sesion) {
        return res.status(401).json({message: 'Sesión no encontrada. Por favor, inicia sesión de nuevo.'});
    }

    //Doble check: la sesión no ha expirado según BD
    if (sesion.expiraEn < new Date()) {
        //Si la sesión expiró, limpiamos su registro en BD
        await prisma.sesion.deleteMany ({
            where: {token},
        });
        return res.status(401).json({message: 'Sesión expirada. Por favor, inicia sesión de nuevo.'});
    }
    //Si todo es correcto: adjuntamos el payload y continuamos
    req.user = payload;
    next();
}

module.exports = verifyToken;