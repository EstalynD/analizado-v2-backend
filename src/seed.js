require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Settings = require('./models/Settings');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado para seeding');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Verificar variables de entorno requeridas
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      console.error('❌ Variables de entorno faltantes:');
      console.error('   ADMIN_USERNAME:', process.env.ADMIN_USERNAME ? '✅' : '❌');
      console.error('   ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✅' : '❌');
      console.error('💡 Configura estas variables en tu archivo .env o en Heroku');
      process.exit(1);
    }

    console.log('🔍 Verificando credenciales de administrador...');
    console.log('👤 Usuario:', process.env.ADMIN_USERNAME);
    console.log('🔐 Contraseña configurada:', process.env.ADMIN_PASSWORD ? '✅' : '❌');

    // Crear admin por defecto
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (!existingAdmin) {
      console.log('🔄 Creando nuevo administrador...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword
      });
      await admin.save();
      console.log('✅ Admin creado exitosamente:', process.env.ADMIN_USERNAME);
    } else {
      console.log('ℹ️  Admin ya existe:', process.env.ADMIN_USERNAME);
      console.log('🔄 Actualizando contraseña...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ Contraseña actualizada');
    }

    // Crear configuración por defecto
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      const settings = new Settings({
        globalDisabled: false
      });
      await settings.save();
      console.log('Configuración inicial creada');
    } else {
      console.log('Configuración ya existe');
    }

    console.log('Seeding completado');
    process.exit(0);
  } catch (error) {
    console.error('Error en seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
