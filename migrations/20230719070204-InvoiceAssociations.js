'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // Invoice hasMany InvoiceItem
        queryInterface.addColumn('InvoiceItems', 'invoice_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Invoices', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('InvoiceItems', 'invoice_id', { transaction: t }),
      ]);
    });
  }
};
