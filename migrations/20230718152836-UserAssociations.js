'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // User hasMany Products
        queryInterface.addColumn('Products', 'user_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // User hasMany Advertisement
        queryInterface.addColumn('Advertisements', 'user_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // User hasMany ProductRatings
        queryInterface.addColumn('ProductRatings', 'user_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // User hasMany Invoice
        queryInterface.addColumn('Invoices', 'user_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
        // User hasMany MonthlyExpenses
        queryInterface.addColumn('MonthlyExpenses', 'user_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Products', 'user_id', { transaction: t }),
        queryInterface.removeColumn('Advertisements', 'user_id', { transaction: t }),
        queryInterface.removeColumn('ProductRatings', 'user_id', { transaction: t }),
        queryInterface.removeColumn('Invoices', 'user_id', { transaction: t }),
        queryInterface.removeColumn('MonthlyExpenses', 'user_id', { transaction: t }),
      ]);
    });
  }
};
