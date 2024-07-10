const { UserRoles } = require("../models")

/*
 Create a class named RoleQueries which will be used to
 communicate with the database using sequelize
*/
class UserRoleQueries {
  table() {
    return UserRoles
  }

  async getAll(query) {
    return await this.table().findAll(query)
  }

  // Create new User Roles
  async createUserRoles(userRoleData, transaction = null) {
    if (transaction) {
      return await this.table().create(userRoleData, {
        transaction: transaction,
      })
    } else {
      return await this.table().create(userRoleData)
    }
  }

  // delete user using id
  async deleteUserRoleByUserId(userId, transaction = null) {
    const query = {
      where: {
        user_id: userId,
      },
    }

    if (transaction) query.transaction = transaction

    return await this.table().destroy(query)
  }
}

module.exports = new UserRoleQueries()
