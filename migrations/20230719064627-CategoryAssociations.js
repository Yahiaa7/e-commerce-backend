'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // Category hasMany Product
        queryInterface.addColumn('Products', 'category_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            references: { model: 'Categories', key: 'id' },
            onUpdate: 'CASCADE', onDelete: 'SET NULL'
          }, { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Products', 'category_id', { transaction: t }),
      ]);
    });
  }
};
