#!/usr/bin/env node

/**
 * Script de inicio mejorado para el backend del analizador
 * Maneja errores y configuración de producción
 */

const path = require('path');

// Configurar rutas
process.env.NODE_PATH = path.join(__dirname, 'src');
require('module')._initPaths();

// Verificar variables de entorno críticas
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingEnvVars.join(', '));
  console.error('💡 Configura las siguientes variables en Heroku:');
  missingEnvVars.forEach(envVar => {
    console.error(`   heroku config:set ${envVar}=valor`);
  });
  process.exit(1);
}

// Configurar logging para producción
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 Iniciando aplicación en modo producción');
  console.log('📊 Variables de entorno configuradas:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? '✅ Configurada' : '❌ Faltante',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Configurada' : '❌ Faltante'
  });
}

// Iniciar la aplicación
try {
  require('./src/server.js');
} catch (error) {
  console.error('💥 Error fatal al iniciar la aplicación:', error);
  process.exit(1);
}
