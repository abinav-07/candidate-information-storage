const AuthenticationRoutes = require("./auth")

const routers = (app) => {
  app.use("/api", AuthenticationRoutes)
}

module.exports = routers
