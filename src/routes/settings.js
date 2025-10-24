const express = require('express');
const Settings = require('../models/Settings');

const router = express.Router();

// GET /api/settings/global - Obtiene estado global
router.get('/global', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ globalDisabled: false });
      await settings.save();
    }

    res.json({
      globalDisabled: settings.globalDisabled,
      updatedAt: settings.updatedAt
    });
  } catch (error) {
    console.error('Error obteniendo configuración global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PATCH /api/settings/global - Toggle desactivación global
router.patch('/global', async (req, res) => {
  try {
    const { globalDisabled } = req.body;

    if (typeof globalDisabled !== 'boolean') {
      return res.status(400).json({ error: 'globalDisabled debe ser un booleano' });
    }

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ globalDisabled });
    } else {
      settings.globalDisabled = globalDisabled;
      settings.updatedAt = new Date();
    }

    await settings.save();

    res.json({
      globalDisabled: settings.globalDisabled,
      updatedAt: settings.updatedAt,
      message: globalDisabled ? 'Analizador desactivado globalmente' : 'Analizador activado globalmente'
    });
  } catch (error) {
    console.error('Error actualizando configuración global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
