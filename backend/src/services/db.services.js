/**Creamos un servicio que servirá de base para los demás servicios. Establece un patrón que seguirán todos los demás. 
 * Es decir creamos un objeto con métodos async que usan Prisma.
 */

const prisma = require('../controllers/prisma');
const logger = require('../controllers/logger');

class dbService {
    async verificarConexion() {
        try {
            await prisma.$queryRaw`SELECT 1`;
            logger.info('Conexión a la base de datos exitosa');
            return true;
        } catch (error) {
            logger.error(`Error al conectar a la base de datos: ${error.message}`);
            return false;
        }
    }

    async desconectar() {
        await prisma.$disconnect();
    }
}

module.exports = dbService;



    