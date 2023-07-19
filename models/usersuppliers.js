'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSuppliers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserSuppliers.belongsTo(models.User, { foreignKey: 'user_id' });
      UserSuppliers.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    }
  }
  UserSuppliers.init({
  }, {
    sequelize,
    modelName: 'UserSuppliers',
  });
  return UserSuppliers;
};