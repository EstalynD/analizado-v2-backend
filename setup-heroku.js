#!/usr/bin/env node

/**
 * Script para configurar variables de entorno en Heroku
 * Uso: node setup-heroku.js
 */

const { execSync } = require('child_process');

console.log('🚀 Configurando variables de entorno en Heroku...\n');

// Función para ejecutar comandos de Heroku
function runHerokuCommand(command) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(`✅ ${command}`);
    return output;
  } catch (error) {
    console.error(`❌ Error ejecutando: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Verificar si estamos en un repositorio de Heroku
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (!remotes.includes('heroku')) {
    console.log('❌ No se encontró remote de Heroku');
    console.log('💡 Ejecuta: heroku git:remote -a tu-app-name');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ No se pudo verificar remotes de git');
  process.exit(1);
}

// Variables de entorno a configurar
const envVars = {
  NODE_ENV: 'production',
  JWT_SECRET: 'analizador_2025_u6bpoyzZdI6XeQWQt3Iwiy7Bnw3hIZHqO9liqoAIA6M',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123_seguro_2025'
};

console.log('📋 Configurando variables de entorno...\n');

// Configurar cada variable
Object.entries(envVars).forEach(([key, value]) => {
  const command = `heroku config:set ${key}="${value}"`;
  runHerokuCommand(command);
});

console.log('\n⚠️  IMPORTANTE: Debes configurar MONGODB_URI manualmente:');
console.log('heroku config:set MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/analizador_db"');
console.log('\n📊 Para verificar todas las variables:');
console.log('heroku config');
console.log('\n🔍 Para ver logs:');
console.log('heroku logs --tail');
console.log('\n🚀 Para desplegar:');
console.log('git push heroku main');

console.log('\n✅ Configuración completada!');
