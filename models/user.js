'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Advertisement, { foreignKey: 'user_id' });
      User.hasMany(models.ProductRatings, { foreignKey: 'user_id' });
      User.hasMany(models.Invoice, { foreignKey: 'user_id' });
      User.hasMany(models.UserProducts, { foreignKey: 'user_id' });
      User.hasMany(models.UserSuppliers, { foreignKey: 'user_id' });
      User.hasMany(models.MonthlyExpenses, { foreignKey: 'user_id' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
    },
    email_address: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Store Manager', 'Advertising Manager', 'User'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};