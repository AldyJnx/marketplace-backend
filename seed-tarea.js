require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Product, User, Category } = require('./src/models');

const categorias = ['Laptops', 'Perifericos', 'Monitores', 'Audio', 'Wearables'];

const asignacion = {
  'Laptop Lenovo IdeaPad 3': { cat: 'Laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
  'Mouse Logitech M170': { cat: 'Perifericos', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600' },
  'Teclado Mecanico Redragon Kumara': { cat: 'Perifericos', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600' },
  'Monitor Samsung 24 pulgadas': { cat: 'Monitores', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600' },
  'Audifonos HyperX Cloud Stinger': { cat: 'Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  'Smartwatch Xiaomi Mi Band 9': { cat: 'Wearables', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' }
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexion establecida');

    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas');

    const mapaCategorias = {};
    for (const nombre of categorias) {
      const [cat] = await Category.findOrCreate({ where: { nombre } });
      mapaCategorias[nombre] = cat.id;
    }
    console.log('Categorias listas:', Object.keys(mapaCategorias).join(', '));

    const productos = await Product.findAll();
    for (const p of productos) {
      const datos = asignacion[p.nombre];
      if (datos) {
        await p.update({ CategoryId: mapaCategorias[datos.cat], imageUrl: datos.img });
      }
    }
    console.log('Productos actualizados con categoria e imagen');

    const usuarios = [
      { nombre: 'Admin Aldy', email: 'admin@marketplace.com', password: 'admin123', role: 'ADMIN' },
      { nombre: 'Cliente Aldy', email: 'cliente@marketplace.com', password: 'cliente123', role: 'CUSTOMER' }
    ];

    for (const u of usuarios) {
      const existe = await User.findOne({ where: { email: u.email } });
      if (!existe) {
        const hashed = await bcrypt.hash(u.password, 10);
        await User.create({ nombre: u.nombre, email: u.email, password: hashed, role: u.role });
        console.log('Usuario creado:', u.email, '/', u.role);
      } else {
        console.log('Usuario ya existe:', u.email);
      }
    }

    console.log('Seed de tarea completado');
    await sequelize.close();
  } catch (error) {
    console.error('Error en seed:', error.message);
    process.exit(1);
  }
})();
