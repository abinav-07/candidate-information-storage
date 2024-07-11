const { Roles } = require("../models")

/*
 Create a class named RoleQueries which will be used to
 communicate with the database using sequelize
*/
class RoleQueries {
  table() {
    return Roles
  }

  async getAll(query) {
    return await this.table().findAll(query)
  }

  // Get role using id or any fitler
  async getRole(filter = null) {
    const query = {
      attributes: ["id", "name"],
    }

    if (filter) query.where = filter

    return await this.table().findOne(query)
  }
}

module.exports = new RoleQueries()
