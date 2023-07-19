'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
      Product.hasMany(models.UserProducts, { foreignKey: 'product_id' });
      Product.hasMany(models.CartItem, { foreignKey: 'product_id' });
      Product.hasMany(models.Advertisement, { foreignKey: 'product_id' });
      Product.hasMany(models.ProductImages, { foreignKey: 'product_id' });
      Product.hasMany(models.ProductRatings, { foreignKey: 'product_id' });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};