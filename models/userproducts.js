'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProducts.belongsTo(models.User, { foreignKey: 'user_id' });
      UserProducts.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  UserProducts.init({
  }, {
    sequelize,
    modelName: 'UserProducts',
  });
  return UserProducts;
};