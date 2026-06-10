/**Este archivo nos permitirá saber si la base de datos esta conectada. Es la consulta más simple. */

const express = require('express');
const prisma = require('../controllers/prisma');
const logger = require('../controllers/logger');

const router = express.Router();

router.get('/ping', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        
            res.json ({
                ok: true,
                message: 'pong',
                timestamp: new Date().toISOString(),
                database: 'conectada',
                entorno: process.env.NODE_ENV || 'development',

            }); 
        } catch (dbError) {
            logger.error (`Health check fallido: ${error.message}`);
            res.status(503).json ({
                ok: false,
                message: 'El servidor está activo pero la base de datos no responde',
                database: 'no conectada',
            });
        }
    });

module.exports = router;