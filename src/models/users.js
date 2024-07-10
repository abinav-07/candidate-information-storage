const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on

      // Basic User Assosciations
      Users.belongsToMany(models.Roles, {
        foreignKey: "user_id",
        through: "user_roles",
        as: "roles",
      })

      Users.hasMany(models.OAuthCredentials, {
        foreignKey: "user_id",
        as: "userOAuths",
      })

      Users.hasOne(models.UserAddress, {
        foreignKey: "user_id",
        as: "userAddress",
      })

      Users.hasOne(models.UserOTP, {
        foreignKey: "user_id",
        as: "userOtps",
      })
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      jwt_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
      modelName: "Users",
      tableName: "users",
    }
  )
  return Users
}
