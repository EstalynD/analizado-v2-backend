require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/auth');
const codesRoutes = require('./routes/codes');
const validationRoutes = require('./routes/validation');
const settingsRoutes = require('./routes/settings');

// Importar middleware
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3070;

// Verificar variables de entorno críticas
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingEnvVars.join(', '));
  console.error('💡 Asegúrate de configurar todas las variables requeridas en Heroku');
  process.exit(1);
}

// Conectar a MongoDB
connectDB();

// Middleware de seguridad
app.use(helmet()); // Protección de headers HTTP
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limitar tamaño de payload
app.use(mongoSanitize()); // Prevenir inyección NoSQL

// Trust proxy (para obtener IP real detrás de proxies)
app.set('trust proxy', 1);

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/validate', validationRoutes);

// Rutas protegidas
app.use('/api/codes', authMiddleware, codesRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API del analizador funcionando',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('🚨 Error en la aplicación:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // En producción, no exponer detalles del error
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(500).json({ 
    error: 'Error interno del servidor',
    ...(isDevelopment && { details: err.message })
  });
});

// Ruta 404
app.use('*', (req, res) => {
  console.log(`🔍 Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('💥 Excepción no capturada:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promesa rechazada no manejada:', reason);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});
