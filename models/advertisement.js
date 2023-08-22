'use strict';
const moment = require('moment');
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
      allowNull: false,
      get() {
        return moment(this.getDataValue('fromDate')).format('YYYY-MM-DD').split("T");
      }
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue('toDate')).format('YYYY-MM-DD').split("T");
      }
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Expired'),
      defaultValue: 'Inactive',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Advertisement',
  });
  return Advertisement;
};