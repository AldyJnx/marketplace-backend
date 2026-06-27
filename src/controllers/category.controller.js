const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['nombre', 'ASC']] });
    res.json({
      success: true,
      message: 'Categorias obtenidas correctamente',
      data: categories
    });
  } catch (error) {
    console.error('Error al obtener categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorias',
      data: null
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido',
        data: null
      });
    }

    const category = await Category.create({ nombre });

    res.status(201).json({
      success: true,
      message: 'Categoria creada correctamente',
      data: category
    });
  } catch (error) {
    console.error('Error al crear categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear categoria',
      data: null
    });
  }
};
