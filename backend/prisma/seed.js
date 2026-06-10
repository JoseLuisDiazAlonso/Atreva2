// prisma/seed.js
// Datos de prueba para FleetAnalyzer Pro
// Ejecutar con: npx prisma db seed

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // ─────────────────────────────────────────────
  // 1. USUARIO ADMINISTRADOR
  // ─────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin1234', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      email: 'admin@empresa.com',
      nombre: 'Administrador',
      passwordHash,
      rol: 'ADMIN',
      activo: true,
    },
  });
  console.log(`✅ Usuario creado: ${admin.email}`);

  // ─────────────────────────────────────────────
  // 2. CONDUCTORES
  // ─────────────────────────────────────────────
  const conductores = await Promise.all([
    prisma.conductor.upsert({
      where: { id: 'conductor-1' },
      update: {},
      create: { id: 'conductor-1', nombre: 'Carlos Martínez' },
    }),
    prisma.conductor.upsert({
      where: { id: 'conductor-2' },
      update: {},
      create: { id: 'conductor-2', nombre: 'Miguel Fernández' },
    }),
    prisma.conductor.upsert({
      where: { id: 'conductor-3' },
      update: {},
      create: { id: 'conductor-3', nombre: 'Antonio López' },
    }),
    prisma.conductor.upsert({
      where: { id: 'conductor-4' },
      update: {},
      create: { id: 'conductor-4', nombre: 'David Sánchez' },
    }),
  ]);
  console.log(`✅ Conductores creados: ${conductores.length}`);

  // ─────────────────────────────────────────────
  // 3. VEHÍCULOS
  // ─────────────────────────────────────────────
  const vehiculos = await Promise.all([
    prisma.vehiculo.upsert({
      where: { id: 'vehiculo-1' },
      update: {},
      create: { id: 'vehiculo-1', matricula: '1234 ABC' },
    }),
    prisma.vehiculo.upsert({
      where: { id: 'vehiculo-2' },
      update: {},
      create: { id: 'vehiculo-2', matricula: '5678 DEF' },
    }),
    prisma.vehiculo.upsert({
      where: { id: 'vehiculo-3' },
      update: {},
      create: { id: 'vehiculo-3', matricula: '9012 GHI' },
    }),
    prisma.vehiculo.upsert({
      where: { id: 'vehiculo-4' },
      update: {},
      create: { id: 'vehiculo-4', matricula: '3456 JKL' },
    }),
  ]);
  console.log(`✅ Vehículos creados: ${vehiculos.length}`);

  // ─────────────────────────────────────────────
  // 4. CLIENTES
  // ─────────────────────────────────────────────
  const clientes = await Promise.all([
    prisma.cliente.upsert({
      where: { id: 'cliente-1' },
      update: {},
      create: { id: 'cliente-1', nombre: 'Mercadona S.A.' },
    }),
    prisma.cliente.upsert({
      where: { id: 'cliente-2' },
      update: {},
      create: { id: 'cliente-2', nombre: 'Lidl Supermercados' },
    }),
    prisma.cliente.upsert({
      where: { id: 'cliente-3' },
      update: {},
      create: { id: 'cliente-3', nombre: 'Carrefour España' },
    }),
    prisma.cliente.upsert({
      where: { id: 'cliente-4' },
      update: {},
      create: { id: 'cliente-4', nombre: 'Alcampo Distribución' },
    }),
    prisma.cliente.upsert({
      where: { id: 'cliente-5' },
      update: {},
      create: { id: 'cliente-5', nombre: 'Eroski Coop.' },
    }),
  ]);
  console.log(`✅ Clientes creados: ${clientes.length}`);

  // ─────────────────────────────────────────────
  // 5. PLANTAS
  // ─────────────────────────────────────────────
  const plantas = await Promise.all([
    prisma.planta.upsert({
      where: { id: 'planta-1' },
      update: {},
      create: { id: 'planta-1', nombre: 'Planta de Tratamiento Norte' },
    }),
    prisma.planta.upsert({
      where: { id: 'planta-2' },
      update: {},
      create: { id: 'planta-2', nombre: 'Centro de Reciclaje Sur' },
    }),
    prisma.planta.upsert({
      where: { id: 'planta-3' },
      update: {},
      create: { id: 'planta-3', nombre: 'Planta Compostaje Este' },
    }),
  ]);
  console.log(`✅ Plantas creadas: ${plantas.length}`);

  // ─────────────────────────────────────────────
  // 6. RUTAS DE PRUEBA (últimos 7 días)
  // ─────────────────────────────────────────────
  const hoy = new Date();
  const rutas = [];
  for (let i = 1; i <= 5; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    fecha.setHours(0, 0, 0, 0);

    const llegada = new Date(fecha);
    llegada.setHours(8, 0, 0, 0);
    const salida = new Date(fecha);
    salida.setHours(14, 30, 0, 0);

    const ruta = await prisma.ruta.create({
      data: {
        fecha,
        conductorId: conductores[i % conductores.length].id,
        vehiculoId: vehiculos[i % vehiculos.length].id,
        clienteId: clientes[i % clientes.length].id,
        horaLlegada: llegada,
        horaSalida: salida,
        observaciones: i === 1 ? 'Ruta con incidencia en acceso al cliente' : null,
      },
    });
    rutas.push(ruta);
  }
  console.log(`✅ Rutas de prueba creadas: ${rutas.length}`);

  console.log('\n🎉 Seed completado correctamente.');
  console.log('─────────────────────────────────────');
  console.log('📧 Usuario admin: admin@empresa.com');
  console.log('🔑 Contraseña:    admin1234');
  console.log('─────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });