'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InvoiceItem.belongsTo(models.Product, { foreignKey: 'product_id' });
      InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
    }
  }
  InvoiceItem.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'InvoiceItem',
  });
  return InvoiceItem;
};