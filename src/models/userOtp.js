const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class UserOTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
    }
  }
  UserOTP.init(
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
      otp_token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      otp_expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      otp_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
      modelName: "UserOTP",
      tableName: "user_otp",
    }
  )
  return UserOTP
}
