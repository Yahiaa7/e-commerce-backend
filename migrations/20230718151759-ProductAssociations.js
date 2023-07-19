'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Product hasMany UserProducts
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('UserProducts', 'product_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Products', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // Product hasMany InvoiceItem
        queryInterface.addColumn('InvoiceItems', 'product_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Products', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // Product hasMany Advertisement
        queryInterface.addColumn('Advertisements', 'product_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Products', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // Product hasMany ProductImages
        queryInterface.addColumn('ProductImages', 'product_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Products', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // Product hasMany ProductRatings
        queryInterface.addColumn('ProductRatings', 'product_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Products', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('UserProducts', 'product_id', { transaction: t }),
        queryInterface.removeColumn('InvoiceItems', 'product_id', { transaction: t }),
        queryInterface.removeColumn('Advertisements', 'product_id', { transaction: t }),
        queryInterface.removeColumn('ProductImages', 'product_id', { transaction: t }),
        queryInterface.removeColumn('ProductRatings', 'product_id', { transaction: t }),
      ]);
    });
  }
};
