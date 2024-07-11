module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    seederStorage: "sequelize",
    define: {
      timeStamps: true,
      paranoid: true,
      // Dynamic name, sequelize sets it to "createdAt"
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
    // logging:(...msg) =>  process.env.NODE_ENV === "development"?console.log(msg):false, //logs sequelize all executions
    logging: (msg) => (process.env.NODE_ENV === "development" ? console.log(msg) : false), //logs sequelize first response from the execution
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: "mysql",
    seederStorage: "sequelize",
    define: {
      timeStamps: true,
      paranoid: true,
      // Dynamic name, sequelize sets it to "createdAt"
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
    logging: false,
  },
}
