const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class OAuthCredentials extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
    }
  }
  OAuthCredentials.init(
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
      provider: {
        //facebook, linkedin ...
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      provider_user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
      modelName: "OAuthCredentials",
      tableName: "oauth_credentials",
    }
  )
  return OAuthCredentials
}
