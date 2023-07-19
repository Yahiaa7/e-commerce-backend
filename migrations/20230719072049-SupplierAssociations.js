'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // Supplier hasMany UserSuppliers
        queryInterface.addColumn('UserSuppliers', 'supplier_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Suppliers', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('UserSuppliers', 'supplier_id', { transaction: t }),
      ]);
    });
  }
};
