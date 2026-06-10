const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
const LOCK_MINUTES = parseInt(process.env.LOCK_DURATION_MINUTES) || 30;

//Login

async function login (email, password, ipOrigin, userAgent) {
    //Buscamos el usuario por email
    const usuario = await prisma.usuario.findUnique({
        where: {email},
    });

    //En caso que no exista. respondemos con un error genérico para no revelar información
    if (!usuario || !usuario.activo) {
        throw {status: 401, message: 'Credenciales incorrectas'};
    }

    //Comprobamos si la cuenta esta bloqueada
    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
        const minutosRestantes = Math.ceil ((usuario.bloqueadoHasta - new Date()) / (1000 * 60));
        throw {
            status: 403,
            message: `Cuenta bloqueada. Inténtalo en ${minutosRestantes} minutos`,
            minutosRestantes,
        };
    }

    //Comparamos la contraseña con el hash almacenado en la BD

    const passwordCorrecta = await bcrypt.compare (password, usuario.passwordHash);

    if (!passwordCorrecta) {
        //Si la contraseña es incorrecta, incrementamos el contador de intentos fallidos
        const nuevosIntentos = usuario.intentosFallidos +1;
        const data = {intentosFallidos: nuevosIntentos};

        //Si se alcanza el máximo, bloqueamos la cuenta
        if (nuevosIntentos >= MAX_ATTEMPTS) {
            data.bloqueadoHasta = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
            data.intentosFallidos = 0; 
        }

        await prisma.usuario.update ({
            where: {id: usuario.id},
            data,
        });

        throw {status: 401, message: 'Credenciales incorrectas'};
    }

    //Login correcto: resetear contadores
    await prisma.usuario.update ({
        where: {id: usuario.id},
        data: {
            intentosFallidos: 0,
            bloqueadoHasta: null,
        },
    });

    //Generamos el token JWT
    const playload = {
        userId: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
    };
    const token = jwt.sign(playload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

    //Calcular la fecha de expiración para guardarla en la tabla Sesión
    const horasMs = parseDuracion(JWT_EXPIRES_IN);
    const expiraEn = new Date(Date.now() + horasMs);

    //Guardamos la sesión en la BD. Concretamente en la tabla Sesión
    await prisma.sesion.create ({
        data: {
            token,
            usuarioId: usuario.id,
            expiraEn,
            ipOrigin: ipOrigin || null,
            userAgent: userAgent || null,
    
        },
    });

   return {
    token,
    user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
    },
   };

   //Logout. Elimina la sesión de la BD para invalidar el token
   async function logout (token) {
    //Borramos el registro de la tabla Sesión.
    await prisma.sesion.deleteMany ({
        where: {token},
    });
   }

   //Hash de contraseña. Utilidad para el seed y la creación de usuarios desde el panel admin
    async function hashPassword (password) {
        const salt = await bcrypt.genSalt(12);
        return bcrypt.hash(password, salt);
    }

    //Utilidad Interna
    function parseDuracion (duracion) {
        const unidad = duracion.slice(-1);
        const valor = parseInt(duracion.slice(0, -1));
        const tabla = {m: 60, h: 35600, d: 86400};
        return (tabla[unidad] || 3600) * valor * 1000;
    }

    module.exports = {
        login,
        logout,
        hashPassword,}

}