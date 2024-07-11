"use strict"

const { USER_ROLES } = require("../enums")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "roles",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.DataTypes.ENUM(USER_ROLES.ADMIN, USER_ROLES.USER),
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          deleted_at: {
            type: Sequelize.DataTypes.DATE,
          },
        },
        { transaction: t }
      )

      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          first_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          last_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          email: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            validate: {
              isEmail: true,
            },
            unique: true,
          },
          password: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          jwt_token: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },

          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          deleted_at: {
            type: Sequelize.DataTypes.DATE,
          },
        },
        { transaction: t }
      )

      await queryInterface.createTable(
        "user_roles",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          role_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "roles",
              key: "id",
            },
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          deleted_at: {
            type: Sequelize.DataTypes.DATE,
          },
        },
        { transaction: t }
      )

      await queryInterface.createTable(
        "candidates",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          added_by: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          first_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          last_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          email: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            validate: {
              isEmail: true,
            },
            unique: true,
          },
          free_text: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          phone_number: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          linkedin_url: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          github_url: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          availability_start_time: {
            type: Sequelize.DataTypes.TIME,
            allowNull: true,
          },
          availability_end_time: {
            type: Sequelize.DataTypes.TIME,
            allowNull: true,
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          deleted_at: {
            type: Sequelize.DataTypes.DATE,
          },
        },
        { transaction: t }
      )
    })
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("candidates", { transaction: t })
      await queryInterface.dropTable("user_roles", { transaction: t })
      await queryInterface.dropTable("roles", { transaction: t })
      await queryInterface.dropTable("users", { transaction: t })
    })
  },
}
