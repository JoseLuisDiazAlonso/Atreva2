# Odin
 
> Aplicación web privada de gestión y análisis de flotas de transporte con módulo integral de residuos.
 
![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-0.1.0-blue)
![Licencia](https://img.shields.io/badge/licencia-privada-red)
![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
 
---
 
## 📋 Descripción
 
FleetAnalyzer Pro es una aplicación web privada para la gestión integral de una flota de vehículos de recogida de residuos. Centraliza el registro de rutas, consumo de combustible, kilómetros recorridos y toda la gestión de residuos (RSU, envases, cartón, vidrio, poda y orgánicos), incluyendo descargas en plantas Reefood.
 
Incorpora un módulo de **análisis inteligente de PDFs** mediante la API de Anthropic (Claude) que cruza automáticamente las rutas planificadas con los registros reales para detectar clientes sin visitar y calcular tiempos de atención por cliente.
 
El stack usa **JavaScript en todo el proyecto** — frontend y backend — lo que simplifica el desarrollo y el mantenimiento al trabajar con un único lenguaje.
 
---
 
## ✨ Funcionalidades
 
### 🗂 Estructura de navegación
 
La aplicación dispone de un **menú lateral fijo** con acceso a todos los módulos. Los módulos de Rutas, Gasolina y Kilómetros presentan una estructura de **tres pestañas**:
 
| Pestaña | Contenido |
|---------|-----------|
| **Formulario** | Entrada de datos del módulo + campo de observaciones |
| **Registros** | Tabla con todos los registros y filtros por cada columna |
| **Observaciones** | Filtro por rango de fechas + listado de tarjetas con fecha, conductor, matrícula y texto |
 
### 🛣 Módulo de Rutas
- Registro de visitas: conductor, matrícula, fecha, cliente, hora llegada, hora salida y tiempo total calculado automáticamente
- Tabla de registros con filtros por conductor, matrícula, cliente y fecha
- Historial de observaciones filtrable por fechas
### ⛽ Módulo de Gasolina
- Registro de repostajes: conductor, matrícula, fecha, litros y precio total
- Tabla con filtros por todos los campos
- Historial de observaciones filtrable por fechas
### 📍 Módulo de Kilómetros
- Registro de km recorridos: conductor, matrícula, fecha y kilómetros
- Tabla con filtros por todos los campos
- Historial de observaciones filtrable por fechas
### ♻️ Módulo de Gestión de Residuos
- **Hoja 1 — Recogida por cliente:** bolsas por tipo (RSU, Envases, Cartón, Vidrio, Poda). Kg calculados automáticamente: `peso estercolero ÷ bolsas totales × bolsas del cliente`
- **Hoja 2 — Códigos LER:** generación automática de código `20 03 11` (10% RSU) y código `19 12 xx` (90% restante), más Envases, Cartón, Vidrio y Poda. Sumatorio total de filas y columnas
- Exportación a PDF de cada hoja
### 🌿 Módulo Reefood
- **Descarga en planta:** conductor, matrícula, cliente, planta, Kg orgánicos y número DI
- **Orgánicos por cliente:** mismos campos sin DI
- KPIs de totales y exportación PDF por pestaña
### 📋 Análisis inteligente de PDF
- Drag & drop para subir el PDF de rutas del día
- Extracción automática de clientes por conductor mediante IA (Claude)
- Cruce con registros reales para detectar clientes sin visitar
- Barra de progreso por conductor, KPIs globales y gráfica de tiempos
### 🗄 Datos maestros
- Gestión de conductores, vehículos, clientes y plantas Reefood
- Altas, bajas y edición con estado activo/inactivo
### 🔐 Seguridad
- Contraseña almacenada hasheada con bcrypt. Nunca en texto plano
- Tokens JWT para gestión de sesión
- Bloqueo temporal tras intentos fallidos
- HTTPS obligatorio en producción
---
 
## 🏗 Arquitectura
 
```
┌─────────────────────────────────────────────────┐
│                  Usuario (navegador)            │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────┐
│         Nginx (proxy inverso + SSL)             │
│                 VPS Hostinger                   │
└──────┬───────────────────────────┬──────────────┘
       │                           │
┌──────▼──────────┐       ┌────────▼─────────────┐
│  React + Vite   │       │  Node.js + Express    │
│  JavaScript     │◄─────►│  Prisma ORM           │──► PostgreSQL 16
│  Tailwind CSS   │       │  multer (PDFs)        │
└─────────────────┘       └────────┬──────────────┘
                                   │
                          ┌────────▼──────────┐
                          │  API Anthropic    │
                          │  (Claude — IA)    │
                          └───────────────────┘
 
         Todo orquestado con Docker Compose
```
 
---
 
## 🗂 Estructura del repositorio
 
```
fleetanalyzer-pro/
├── frontend/                      # React + Vite + JavaScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Sidebar, Topbar, Layout principal
│   │   │   ├── forms/             # Formularios de cada módulo
│   │   │   ├── tables/            # Tablas con filtros
│   │   │   ├── observations/      # Pestaña de observaciones
│   │   │   └── charts/            # Gráficas (Recharts)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Rutas.jsx
│   │   │   ├── Gasolina.jsx
│   │   │   ├── Kilometros.jsx
│   │   │   ├── Residuos.jsx
│   │   │   ├── Reefood.jsx
│   │   │   ├── AnalisisPDF.jsx
│   │   │   └── Maestros.jsx
│   │   ├── hooks/                 # useAuth, useApi, useFiltros...
│   │   ├── services/              # Llamadas a la API con Axios
│   │   └── utils/                 # Helpers y utilidades
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                       # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/                # Endpoints por módulo
│   │   │   ├── auth.js
│   │   │   ├── rutas.js
│   │   │   ├── combustible.js
│   │   │   ├── kilometraje.js
│   │   │   ├── residuos.js
│   │   │   ├── reefood.js
│   │   │   ├── pdf.js
│   │   │   └── maestros.js
│   │   ├── middleware/            # JWT auth, manejo de errores
│   │   ├── services/              # Lógica de negocio
│   │   └── app.js                 # Punto de entrada Express
│   ├── prisma/
│   │   ├── schema.prisma          # Definición de las 13 tablas
│   │   ├── migrations/            # Migraciones versionadas
│   │   └── seed.js                # Datos iniciales
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── backup.sh                  # Script de backup automático
│
├── nginx/
│   └── nginx.conf                 # Proxy inverso + SSL
│
├── docker-compose.yml             # Producción
├── docker-compose.dev.yml         # Desarrollo local
├── .env.example                   # Variables de entorno de ejemplo
├── .gitignore
└── README.md
```
 
---
 
## 🗄 Base de datos — 13 tablas
 
| Bloque | Tablas |
|--------|--------|
| **Autenticación** | `usuario`, `sesion` |
| **Datos maestros** | `conductor`, `vehiculo`, `cliente`, `planta` |
| **Operaciones de flota** | `ruta`, `combustible`, `kilometraje` |
| **Gestión de residuos** | `recogida_residuo`, `estercolero`, `reefood_descarga`, `organico_cliente` |
 
Las tablas `ruta`, `combustible` y `kilometraje` incluyen el campo `observaciones` para el registro de incidencias y notas del conductor.
 
El esquema se define en `prisma/schema.prisma` y las migraciones se gestionan automáticamente con `npx prisma migrate dev`.
 
---
 
## 🛠 Stack tecnológico
 
| Capa | Tecnología | Versión | Uso |
|------|-----------|---------|-----|
| **Frontend** | React | 18 | Interfaz de usuario |
| | Vite | 5 | Bundler ultrarrápido |
| | JavaScript | ES2024 | Lenguaje único en todo el proyecto |
| | Tailwind CSS | 4 | Estilos utility-first |
| | React Router | 6 | Navegación y rutas protegidas |
| | Recharts | 2 | Gráficas de datos |
| | Axios | 1 | Cliente HTTP con interceptores JWT |
| **Backend** | Node.js | 20 LTS | Entorno de ejecución JavaScript |
| | Express | 4 | Framework API REST |
| | Prisma | 5 | ORM + migraciones para PostgreSQL |
| | bcryptjs | — | Hash de contraseñas |
| | jsonwebtoken | — | Tokens JWT de sesión |
| | multer | 1 | Subida de archivos PDF |
| | Anthropic SDK | 0.40 | Análisis de PDFs con Claude |
| **Base de datos** | PostgreSQL | 16 | Almacenamiento principal |
| | pgAdmin | 8 | Gestión visual (desarrollo) |
| **Infraestructura** | Docker Compose | 2 | Orquestación de servicios |
| | Nginx | 1.26 | Proxy inverso + archivos estáticos |
| | Let's Encrypt | — | Certificado SSL gratuito |
| | GitHub | — | Repositorio y tablón Kanban |
 
---
 
## 🚀 Instalación y puesta en marcha
 
### Requisitos previos
 
- [Node.js v20 LTS](https://nodejs.org/) instalado
- [Docker](https://docs.docker.com/get-docker/) y Docker Compose instalados
- Clave de API de Anthropic ([obtener aquí](https://console.anthropic.com))
- Dominio apuntando al VPS (para producción con HTTPS)
### 1. Clonar el repositorio
 
```bash
git clone https://github.com/tu-usuario/fleetanalyzer-pro.git
cd fleetanalyzer-pro
```
 
### 2. Configurar variables de entorno
 
```bash
cp .env.example .env
```
 
Editar `.env`:
 
```env
# Base de datos
POSTGRES_DB=fleetanalyzer
POSTGRES_USER=fleet_user
POSTGRES_PASSWORD=contraseña_segura_aqui
DATABASE_URL="postgresql://fleet_user:contraseña_segura_aqui@localhost:5432/fleetanalyzer"
 
# Backend
JWT_SECRET=clave_jwt_muy_larga_y_aleatoria_minimo_32_caracteres
ANTHROPIC_API_KEY=sk-ant-...
 
# Acceso a la aplicación
APP_USERNAME=admin
APP_PASSWORD=contraseña_de_acceso
 
# Frontend
VITE_API_URL=https://tu-dominio.com/api
```
 
> ⚠️ El archivo `.env` está en `.gitignore`. Nunca subas credenciales al repositorio.
 
### 3. Instalar dependencias
 
```bash
# Frontend
cd frontend && npm install
 
# Backend
cd ../backend && npm install
```
 
### 4. Arrancar en desarrollo
 
```bash
docker compose -f docker-compose.dev.yml up --build
```
 
| Servicio | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:3000` |
| PostgreSQL | `localhost:5432` |
 
### 5. Ejecutar migraciones de base de datos (primera vez)
 
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```
 
### 6. Arrancar en producción (VPS)
 
```bash
git clone https://github.com/tu-usuario/fleetanalyzer-pro.git
cd fleetanalyzer-pro
cp .env.example .env
# Editar .env con valores de producción
docker compose up -d --build
```
 
### 7. Configurar HTTPS (primera vez en el VPS)
 
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```
 
---
