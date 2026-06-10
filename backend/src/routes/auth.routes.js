/**Configura la autenticación de las rutas */

const express = require('express');
const router = express.Router();
const {login, logout} = require('../services/auth.service');
const verifyToken = require('../middleware/verifyToken');

//Post para login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email y contraseña son obligatorios'});
    }

    try {
        //Capturamos IP y userAgent para guardarlos en la sesión
        const ipOrigen = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers ['user-agent'];

        const resultado = await login(email, password, ipOrigen, userAgent);
        return res.status(200).json(resultado);
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Error interno del servidor';
        return res.status(status).json({error:message, minutosRestantes: error.minutosRestantes});
    }
});

//Post para logout
router.post('/logout', verifyToken, async (req, res) => {
    try {
        //Extraemos el token del header para borrarlo de la tabla sesión
        const token = req.headers['authorization'].split('')[1];
        await logout(token);

        return res.status(200).json({
            message: `Sesión cerrada correctamente. Hasta pronto, ${req.user.nombre}`,
        });
    } catch (error) {
        return res.status(500).json({message: 'Error al cerrar sesión'});
    }
});

module.exports = router;