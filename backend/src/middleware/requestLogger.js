/**Creamos un archivo que nos permita registrar cada petición y cuanto tardó en llegar a responderse */

const logger = require('../controllers/logger');

const requestLogger = (req, res, next) => {
    const inicio = Date.now();
    logger.info (`--> ${req.method} ${req.path}`);

    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        logger.info (`<-- ${req.method} ${req.path} ${res.statusCode} - ${duracion}ms`);
    });

    next();
};

module.exports = requestLogger;