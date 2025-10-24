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

    // Crear admin por defecto
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword
      });
      await admin.save();
      console.log('Admin creado:', process.env.ADMIN_USERNAME);
    } else {
      console.log('Admin ya existe');
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
