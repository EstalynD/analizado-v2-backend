const Session = require('../models/Session');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const session = await Session.findOne({ token }).populate('adminId');
    
    if (!session) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({ error: 'Token expirado' });
    }

    req.admin = session.adminId;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = authMiddleware;
