/**Creamos un archivo que maneje los diferentes errores */

const logger = require('../controllers/logger');

const errorHandler = (err, req, res, next) => {
    logger.error (`Error en ${req.method} ${req.path}: ${err.message}`);

    if (err.code === 'P2002') {
        return res.status(409).json({
            ok: false,
            message: 'Ya existe un registro con ese valor único',
            campo: err.meta?.target,
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            ok: false,
            message: 'Registro no encontrado',
        });
    }

    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        ok: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;