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
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`API disponible en: http://localhost:${PORT}/api`);
});
