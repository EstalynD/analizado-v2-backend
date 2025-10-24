const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Code = require('../models/Code');

const router = express.Router();

// GET /api/codes - Lista todos los códigos
router.get('/', async (req, res) => {
  try {
    const codes = await Code.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (error) {
    console.error('Error obteniendo códigos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/codes - Genera nuevo código
router.post('/', async (req, res) => {
  try {
    const code = uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
    const formattedCode = `${code.substring(0, 4)}-${code.substring(4, 8)}-${code.substring(8, 12)}-${code.substring(12, 16)}`;

    const newCode = new Code({
      code: formattedCode
    });

    await newCode.save();
    res.status(201).json(newCode);
  } catch (error) {
    console.error('Error creando código:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PATCH /api/codes/:id - Actualiza estado individual
router.patch('/:id', async (req, res) => {
  try {
    const { isActive } = req.body;
    const code = await Code.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!code) {
      return res.status(404).json({ error: 'Código no encontrado' });
    }

    res.json(code);
  } catch (error) {
    console.error('Error actualizando código:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/codes/:id - Elimina código
router.delete('/:id', async (req, res) => {
  try {
    const code = await Code.findByIdAndDelete(req.params.id);

    if (!code) {
      return res.status(404).json({ error: 'Código no encontrado' });
    }

    res.json({ message: 'Código eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando código:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
