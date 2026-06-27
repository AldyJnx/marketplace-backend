const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_marketplace';

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y password son requeridos',
        data: null
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'El email ya esta registrado',
        data: null
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      password: hashed,
      role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      data: null
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son requeridos',
        data: null
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales invalidas',
        data: null
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales invalidas',
        data: null
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Inicio de sesion correcto',
      data: {
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesion:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesion',
      data: null
    });
  }
};

exports.me = async (req, res) => {
  res.json({
    success: true,
    message: 'Usuario autenticado',
    data: req.user
  });
};
