'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Advertisement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Advertisement.belongsTo(models.User, { foreignKey: 'user_id' });
      Advertisement.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  Advertisement.init({
    newPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Inactive',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Advertisement',
  });
  return Advertisement;
};