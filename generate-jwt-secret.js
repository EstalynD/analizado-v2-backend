const crypto = require('crypto');

/**
 * Genera una clave JWT secreta segura
 * @param {number} length - Longitud de la clave (por defecto 64 caracteres)
 * @returns {string} - Clave JWT secreta
 */
function generateJWTSecret(length = 64) {
    // Genera bytes aleatorios y los convierte a base64
    const randomBytes = crypto.randomBytes(length);
    const secret = randomBytes.toString('base64');
    
    // Reemplaza caracteres que podrían causar problemas en variables de entorno
    return secret.replace(/[+/=]/g, (match) => {
        switch(match) {
            case '+': return '-';
            case '/': return '_';
            case '=': return '';
            default: return match;
        }
    });
}

/**
 * Genera una clave JWT con formato específico para el analizador
 * @returns {string} - Clave JWT con formato personalizado
 */
function generateAnalizadorJWTSecret() {
    const timestamp = new Date().getFullYear();
    const randomPart = generateJWTSecret(32);
    return `analizador_${timestamp}_${randomPart}`;
}

// Función principal
function main() {
    console.log('🔐 Generador de Clave JWT Secreta para Analizador');
    console.log('=' .repeat(50));
    
    // Genera clave con formato personalizado
    const customSecret = generateAnalizadorJWTSecret();
    console.log('\n📋 Clave JWT con formato personalizado:');
    console.log(`JWT_SECRET=${customSecret}`);
    
    // Genera clave completamente aleatoria
    const randomSecret = generateJWTSecret(64);
    console.log('\n🎲 Clave JWT completamente aleatoria:');
    console.log(`JWT_SECRET=${randomSecret}`);
    
    // Genera clave más corta para desarrollo
    const devSecret = generateJWTSecret(32);
    console.log('\n🛠️  Clave JWT para desarrollo (más corta):');
    console.log(`JWT_SECRET=${devSecret}`);
    
    console.log('\n' + '=' .repeat(50));
    console.log('💡 Recomendaciones:');
    console.log('• Usa la clave personalizada para producción');
    console.log('• Usa la clave aleatoria para máxima seguridad');
    console.log('• Usa la clave de desarrollo para testing');
    console.log('• Guarda la clave en un archivo .env');
    console.log('• Nunca compartas la clave en repositorios públicos');
    
    return {
        custom: customSecret,
        random: randomSecret,
        development: devSecret
    };
}

// Ejecuta el script si se llama directamente
if (require.main === module) {
    main();
}

module.exports = {
    generateJWTSecret,
    generateAnalizadorJWTSecret,
    main
};
