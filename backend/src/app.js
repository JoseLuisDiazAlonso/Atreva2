require ('dotenv').config({path: require ('path').join (__dirname, '../.env')});

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');           
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');

const app = express();

//Midlewares
app.use(cors ({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

//Rutas
app.use ('/api/health', healthRoutes);
app.use ('/api/auth', authRoutes);                           

//404
app.use ((req, res) => {
    res.status(404).json({ok: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`});
});

// Errores globales
app.use (errorHandler);

module.exports = app;