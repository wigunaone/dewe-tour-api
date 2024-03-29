'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      fullname:"wigunaone",
      email: "wigunaone@gmail.com",
      password: "asdfghjkl",
      status: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
    //  * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
