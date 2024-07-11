const { Model } = require("sequelize")
const { USER_ROLES } = require("../enums")

module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
      Roles.belongsToMany(models.Users, {
        foreignKey: "role_id",
        through: "user_roles",
        as: "users",
      })
    }
  }
  Roles.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.ENUM(USER_ROLES.ADMIN, USER_ROLES.USER),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
      modelName: "Roles",
      tableName: "roles",
    }
  )
  return Roles
}
