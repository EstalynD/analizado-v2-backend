const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    
    // Configuración simple
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB conectado exitosamente');
    
  } catch (error) {
    console.error('💥 Error conectando a MongoDB:', error.message);
    console.log('💡 Instala MongoDB o usa MongoDB Atlas');
    console.log('💡 Para instalar MongoDB local: https://www.mongodb.com/try/download/community');
    console.log('💡 Para usar MongoDB Atlas (gratis): https://www.mongodb.com/atlas');
    process.exit(1);
  }
};

module.exports = connectDB;
