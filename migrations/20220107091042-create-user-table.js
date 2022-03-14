// "use strict";

// const createUserTableObj = (Sequelize) => ({
//   id: {
//     type: Sequelize.INTEGER(11),
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   firstName: Sequelize.INTEGER(25),
//   createdAt: Sequelize.DATE,
//   updatedAt: Sequelize.DATE
// });

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     queryInterface.createTable("User", createUserTableObj(Sequelize));
//   },

//   down: async (queryInterface, Sequelize) => {
//     queryInterface.dropTable("User");
//   }
// };