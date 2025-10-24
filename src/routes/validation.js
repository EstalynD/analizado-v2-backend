const express = require('express');
const rateLimit = require('express-rate-limit');
const Code = require('../models/Code');
const Settings = require('../models/Settings');

const router = express.Router();

// Rate limiting básico
const validationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 intentos por IP
  message: {
    error: 'Demasiados intentos de validación. Intenta nuevamente en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Función para registrar intentos de validación
async function logValidationAttempt(code, success, ip, reason = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Validación - IP: ${ip}, Código: ${code.substring(0, 4)}***, Éxito: ${success}, Razón: ${reason || 'N/A'}`);
  
  // TODO: Guardar en base de datos si se requiere auditoría completa
  // const log = new ValidationLog({ code, success, ip, reason, timestamp });
  // await log.save();
}

// POST /api/validate - Valida código + verifica estado global
router.post('/validate', validationLimiter, async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  
  try {
    const { code } = req.body;

    if (!code) {
      await logValidationAttempt('N/A', false, clientIp, 'missing_code');
      return res.status(400).json({ error: 'Código requerido' });
    }

    // Verificar estado global
    const settings = await Settings.findOne();
    if (settings && settings.globalDisabled) {
      await logValidationAttempt(code, false, clientIp, 'global_disabled');
      return res.json({
        valid: false,
        reason: 'global_disabled',
        message: 'Analizador desactivado globalmente'
      });
    }

    // Buscar código
    const codeDoc = await Code.findOne({ code });
    if (!codeDoc) {
      await logValidationAttempt(code, false, clientIp, 'code_not_found');
      return res.json({
        valid: false,
        reason: 'code_not_found',
        message: 'Código no encontrado'
      });
    }

    if (!codeDoc.isActive) {
      await logValidationAttempt(code, false, clientIp, 'code_inactive');
      return res.json({
        valid: false,
        reason: 'code_inactive',
        message: 'Código desactivado'
      });
    }

    // Incrementar contador de uso y registrar última validación
    codeDoc.usageCount += 1;
    codeDoc.lastUsed = new Date();
    await codeDoc.save();

    await logValidationAttempt(code, true, clientIp, 'success');
    
    res.json({
      valid: true,
      message: 'Código válido'
    });
  } catch (error) {
    console.error('Error validando código:', error);
    await logValidationAttempt('ERROR', false, clientIp, 'server_error');
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/validate/status - Verifica solo el estado global
router.get('/status', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const globalDisabled = settings ? settings.globalDisabled : false;

    res.json({
      global_disabled: globalDisabled,
      message: globalDisabled ? 'Analizador desactivado globalmente' : 'Analizador activo'
    });
  } catch (error) {
    console.error('Error verificando estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
