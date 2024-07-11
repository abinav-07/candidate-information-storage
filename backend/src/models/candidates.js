const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Candidates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
      Candidates.belongsTo(models.Users, { targetKey: "id", foreignKey: "added_by" })
    }
  }
  Candidates.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      added_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      free_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      linkedin_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      github_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      availability_start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      availability_end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
      modelName: "Candidates",
      tableName: "candidates",
    }
  )
  return Candidates
}
