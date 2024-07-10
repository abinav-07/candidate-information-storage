const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
      UserRoles.belongsTo(models.Users, { targetKey: "id", foreignKey: "user_id" })
      UserRoles.belongsTo(models.Roles, { targetKey: "id", foreignKey: "role_id" })
    }
  }
  UserRoles.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
      modelName: "UserRoles",
      tableName: "user_roles",
    }
  )
  return UserRoles
}
