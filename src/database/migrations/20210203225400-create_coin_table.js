'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
    	await queryInterface.createTable('coins', { 
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			pair: Sequelize.STRING,
			mms_20: Sequelize.DOUBLE,
			mms_50: Sequelize.DOUBLE,
			mms_200: Sequelize.DOUBLE,
			timestamp: Sequelize.DATE
		});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.dropTable('coins');
	}
};
