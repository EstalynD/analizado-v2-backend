const express = require('express');
const rateLimit = require('express-rate-limit');
const Report = require('../models/Report');

const router = express.Router();

// Determinar URL del frontend según el entorno
// En Heroku, detectamos producción por la presencia de variables específicas de Heroku o NODE_ENV=production
const isProduction = process.env.NODE_ENV === 'production' || 
                     process.env.DYNO || // Heroku agrega esta variable
                     process.env.HEROKU_APP_NAME; // Variable opcional de Heroku

const getFrontendUrl = () => {
  // Si hay una variable de entorno explícita, usarla
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }
  
  // Si estamos en producción, usar la URL de producción de Vercel
  if (isProduction) {
    return 'https://analizado-v2-frontend.vercel.app';
  }
  
  // Por defecto, desarrollo local
  return 'http://localhost:3071';
};

// Rate limiting para creación de reportes
const createReportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 reportes por IP cada 15 minutos
  message: {
    error: 'Demasiados intentos. Intenta nuevamente en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para obtener reportes (público)
const getReportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // máximo 50 consultas por IP cada 15 minutos
  message: {
    error: 'Demasiadas consultas. Intenta nuevamente en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/reports - Crear un nuevo reporte
router.post('/', createReportLimiter, async (req, res) => {
  try {
    const { speedTestResult, hardwareInfo, streamingAnalysis } = req.body;

    // Validar que se proporcionen todos los datos necesarios
    if (!speedTestResult || !hardwareInfo || !streamingAnalysis) {
      return res.status(400).json({ 
        error: 'Datos incompletos. Se requieren speedTestResult, hardwareInfo y streamingAnalysis.' 
      });
    }

    // Crear el reporte
    const report = new Report({
      speedTestResult,
      hardwareInfo,
      streamingAnalysis
    });

    await report.save();

    // Retornar el reportId y el enlace público usando la URL correcta según el entorno
    const frontendUrl = getFrontendUrl();
    const publicLink = `${frontendUrl}/report/${report.reportId}`;

    // Log para debugging (solo en desarrollo)
    if (!isProduction) {
      console.log(`📝 Generando enlace para reporte ${report.reportId}`);
      console.log(`🌐 Frontend URL: ${frontendUrl}`);
      console.log(`🔗 Enlace público: ${publicLink}`);
    }

    res.status(201).json({
      success: true,
      reportId: report.reportId,
      publicLink: publicLink,
      expiresAt: report.expiresAt,
      message: 'Reporte creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando reporte:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al crear el reporte',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/reports/:reportId - Obtener un reporte público
router.get('/:reportId', getReportLimiter, async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ error: 'ID de reporte requerido' });
    }

    // Buscar el reporte
    const report = await Report.findOne({ reportId });

    if (!report) {
      return res.status(404).json({ 
        error: 'Reporte no encontrado',
        message: 'El reporte solicitado no existe o ha expirado'
      });
    }

    // Verificar si el reporte ha expirado
    if (new Date() > report.expiresAt) {
      // Eliminar el reporte expirado
      await Report.deleteOne({ reportId });
      return res.status(410).json({ 
        error: 'Reporte expirado',
        message: 'Este reporte ha expirado y ya no está disponible'
      });
    }

    // Retornar el reporte (sin información sensible)
    res.json({
      success: true,
      reportId: report.reportId,
      speedTestResult: report.speedTestResult,
      hardwareInfo: report.hardwareInfo,
      streamingAnalysis: report.streamingAnalysis,
      createdAt: report.createdAt,
      expiresAt: report.expiresAt
    });
  } catch (error) {
    console.error('Error obteniendo reporte:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener el reporte',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

