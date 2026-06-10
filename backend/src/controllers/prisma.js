/**Vamos a crear un archivo a parte de prisma para que todos los archivos importen el mismo cliente Prisma */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;