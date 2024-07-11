"use strict"

const { USER_ROLES } = require("../enums")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: USER_ROLES.ADMIN,
        },
        {
          name: USER_ROLES.USER,
        },
      ],
      {}
    )

    await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "John",
          last_name: "Don",
          email: "admin@gmail.com",
          password: "$2a$12$rEp6m9wsUklwdoVhrQ7gnOW1RtfbzGj/Eme2XVrfJbiwjFk/H6oMa",
        },
      ],
      {}
    )

    await queryInterface.bulkInsert(
      "user_roles",
      [
        {
          role_id: 1,
          user_id: 1,
        },
      ],
      {}
    )

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("user_roles", null, {})
    await queryInterface.bulkDelete("roles", null, {})
    await queryInterface.bulkDelete("users", null, {})
  },
}
