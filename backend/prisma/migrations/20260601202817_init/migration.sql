-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'OPERADOR');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'OPERADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "intentosFallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoHasta" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipOrigen" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conductores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "conductores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "plantas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rutas" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "conductorId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "horaLlegada" TIME,
    "horaSalida" TIME,
    "tiempoEnCliente" INTEGER,
    "observaciones" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rutas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combustible" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "conductorId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "litros" DECIMAL(8,2) NOT NULL,
    "precioLitro" DECIMAL(6,3) NOT NULL,
    "precioTotal" DECIMAL(10,2) NOT NULL,
    "gasolinera" TEXT,
    "observaciones" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "combustible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kilometraje" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "conductorId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "kmInicio" INTEGER,
    "kmFin" INTEGER,
    "kmRecorridos" INTEGER NOT NULL,
    "observaciones" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kilometraje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refood" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "clienteId" TEXT NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "numeroAlbaran" TEXT NOT NULL,
    "observaciones" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residuos" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "periodo" DATE NOT NULL,
    "fraccionResto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "envasesPlastico" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cartonPapel" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "vidrio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "residuos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_token_key" ON "sesiones"("token");

-- CreateIndex
CREATE INDEX "sesiones_token_idx" ON "sesiones"("token");

-- CreateIndex
CREATE INDEX "sesiones_usuarioId_idx" ON "sesiones"("usuarioId");

-- CreateIndex
CREATE INDEX "sesiones_expiraEn_idx" ON "sesiones"("expiraEn");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_matricula_key" ON "vehiculos"("matricula");

-- CreateIndex
CREATE INDEX "rutas_fecha_idx" ON "rutas"("fecha");

-- CreateIndex
CREATE INDEX "rutas_conductorId_idx" ON "rutas"("conductorId");

-- CreateIndex
CREATE INDEX "rutas_vehiculoId_idx" ON "rutas"("vehiculoId");

-- CreateIndex
CREATE INDEX "rutas_clienteId_idx" ON "rutas"("clienteId");

-- CreateIndex
CREATE INDEX "rutas_fecha_conductorId_idx" ON "rutas"("fecha", "conductorId");

-- CreateIndex
CREATE INDEX "rutas_fecha_vehiculoId_idx" ON "rutas"("fecha", "vehiculoId");

-- CreateIndex
CREATE INDEX "combustible_fecha_idx" ON "combustible"("fecha");

-- CreateIndex
CREATE INDEX "combustible_conductorId_idx" ON "combustible"("conductorId");

-- CreateIndex
CREATE INDEX "combustible_vehiculoId_idx" ON "combustible"("vehiculoId");

-- CreateIndex
CREATE INDEX "combustible_fecha_vehiculoId_idx" ON "combustible"("fecha", "vehiculoId");

-- CreateIndex
CREATE INDEX "kilometraje_fecha_idx" ON "kilometraje"("fecha");

-- CreateIndex
CREATE INDEX "kilometraje_conductorId_idx" ON "kilometraje"("conductorId");

-- CreateIndex
CREATE INDEX "kilometraje_vehiculoId_idx" ON "kilometraje"("vehiculoId");

-- CreateIndex
CREATE INDEX "kilometraje_fecha_vehiculoId_idx" ON "kilometraje"("fecha", "vehiculoId");

-- CreateIndex
CREATE INDEX "refood_fecha_idx" ON "refood"("fecha");

-- CreateIndex
CREATE INDEX "refood_clienteId_idx" ON "refood"("clienteId");

-- CreateIndex
CREATE INDEX "refood_fecha_clienteId_idx" ON "refood"("fecha", "clienteId");

-- CreateIndex
CREATE INDEX "residuos_clienteId_idx" ON "residuos"("clienteId");

-- CreateIndex
CREATE INDEX "residuos_periodo_idx" ON "residuos"("periodo");

-- CreateIndex
CREATE INDEX "residuos_clienteId_periodo_idx" ON "residuos"("clienteId", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "residuos_clienteId_periodo_key" ON "residuos"("clienteId", "periodo");

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "conductores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combustible" ADD CONSTRAINT "combustible_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "conductores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combustible" ADD CONSTRAINT "combustible_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kilometraje" ADD CONSTRAINT "kilometraje_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "conductores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kilometraje" ADD CONSTRAINT "kilometraje_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refood" ADD CONSTRAINT "refood_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residuos" ADD CONSTRAINT "residuos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
