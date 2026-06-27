const sequelize = require('../config/database');
const Product = require('./Product');
const User = require('./User');
const Category = require('./Category');

Category.hasMany(Product, { foreignKey: 'CategoryId' });
Product.belongsTo(Category, { foreignKey: 'CategoryId' });

module.exports = {
  sequelize,
  Product,
  User,
  Category
};
