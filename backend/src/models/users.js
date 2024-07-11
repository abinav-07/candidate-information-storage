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

      Users.hasMany(models.Candidates, {
        foreignKey: "added_by",
        as: "added_candidates",
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
      jwt_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      // Soft delete
      paranoid: true,
      sequelize,
      modelName: "Users",
      tableName: "users",
    }
  )
  return Users
}
