const AuthenticationRoutes = require("./auth")
const AdminRoutes = require("./admin")

const routers = (app) => {
  app.use("/api", AuthenticationRoutes)
  app.use("/api/admin", AdminRoutes)
}

module.exports = routers
