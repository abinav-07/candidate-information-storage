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
            type: Sequelize.DataTypes.ENUM(USER_ROLES.ADMIN, USER_ROLES.MENTOR, USER_ROLES.STUDENT),
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
          dob: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true,
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },
          password: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          phone_number: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          jwt_token: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },
          is_verified: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          profile_image: {
            type: Sequelize.DataTypes.STRING(255),
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
        "oauth_credentials",
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
          provider: {
            //facebook, linkedin ...
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          provider_user_id: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          access_token: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          refresh_token: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },
          expires_at: {
            type: Sequelize.DataTypes.DATE,
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
        "user_address",
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
          country: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false,
          },
          city: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false,
          },
          postal_code: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          latitude: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false,
          },
          longitude: {
            type: Sequelize.DataTypes.FLOAT,
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
        "user_otp",
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
          otp_token: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          otp_expiry_date: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          otp_verified: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
      await queryInterface.dropTable("oauth_credentials", { transaction: t })
      await queryInterface.dropTable("user_roles", { transaction: t })
      await queryInterface.dropTable("user_address", { transaction: t })
      await queryInterface.dropTable("user_otp", { transaction: t })
      await queryInterface.dropTable("roles", { transaction: t })
      await queryInterface.dropTable("users", { transaction: t })
    })
  },
}
