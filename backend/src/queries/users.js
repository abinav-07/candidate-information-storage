const { Users, Roles } = require("../models")

/*
 Create a class named UserQueries which will be used to
 communicate with the database using sequelize
*/
class UserQueries {
  table() {
    return Users
  }

  async getAll(query = {}, transaction = null) {
    if (transaction) query.transaction = transaction

    return await this.table().findAll(query)
  }

  // Get User using id or any fitler
  async getUser(filter = null, transaction = null) {
    const query = {
      include: [
        {
          model: Roles,
          attributes: ["id", "name"],
          as: "roles",
          // I dont want the many to many table data
          through: {
            attributes: [],
          },
        },
      ],
    }

    if (filter) query.where = filter

    if (transaction) query.transaction = transaction

    return await this.table().findOne(query)
  }

  // Create new user
  async createUser(userData, transaction = null) {
    if (transaction) {
      return await this.table().create(userData, {
        transaction: transaction,
      })
    } else {
      return await this.table().create(userData)
    }
  }

  // update user using id and values
  async updateUser(id, values, transaction = null) {
    const query = {
      where: {
        id,
      },
    }

    if (transaction) query.transaction = transaction

    return await this.table().update({ ...values }, query)
  }

  // delete user using id
  async deleteUser(id, transaction = null) {
    const query = {
      where: {
        id,
      },
    }

    if (transaction) query.transaction = transaction

    return await this.table().destroy(query)
  }
}

module.exports = new UserQueries()
