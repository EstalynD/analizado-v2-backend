const crypto = require('crypto');

/**
 * Genera credenciales seguras para el administrador
 */
function generateSecureCredentials() {
  // Generar username único
  const timestamp = new Date().getFullYear();
  const randomId = crypto.randomBytes(4).toString('hex');
  const username = `admin_analizador_${timestamp}_${randomId}`;
  
  // Generar password seguro
  const passwordLength = 16;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < passwordLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return { username, password };
}

/**
 * Genera credenciales con formato específico para el analizador
 */
function generateAnalizadorCredentials() {
  const timestamp = new Date().getFullYear();
  const randomPart = crypto.randomBytes(6).toString('hex');
  
  return {
    username: `admin_analizador_${timestamp}`,
    password: `Analizador${timestamp}!${randomPart}`
  };
}

// Función principal
function main() {
  console.log('🔐 Generador de Credenciales de Administrador');
  console.log('=' .repeat(50));
  
  // Generar credenciales seguras
  const secureCreds = generateSecureCredentials();
  console.log('\n🔒 Credenciales seguras:');
  console.log(`ADMIN_USERNAME=${secureCreds.username}`);
  console.log(`ADMIN_PASSWORD=${secureCreds.password}`);
  
  // Generar credenciales con formato del analizador
  const analizadorCreds = generateAnalizadorCredentials();
  console.log('\n📋 Credenciales para analizador:');
  console.log(`ADMIN_USERNAME=${analizadorCreds.username}`);
  console.log(`ADMIN_PASSWORD=${analizadorCreds.password}`);
  
  console.log('\n' + '=' .repeat(50));
  console.log('💡 Recomendaciones:');
  console.log('• Usa las credenciales seguras para producción');
  console.log('• Guarda las credenciales en un lugar seguro');
  console.log('• No compartas las credenciales en repositorios públicos');
  console.log('• Configura estas variables en Heroku:');
  console.log('  heroku config:set ADMIN_USERNAME="valor"');
  console.log('  heroku config:set ADMIN_PASSWORD="valor"');
  
  return {
    secure: secureCreds,
    analizador: analizadorCreds
  };
}

// Ejecuta el script si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  generateSecureCredentials,
  generateAnalizadorCredentials,
  main
};
