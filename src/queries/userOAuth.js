const { OAuthCredentials } = require("../models")

class OAuthCredentialsQueries {
  table() {
    return OAuthCredentials
  }

  async getAll(query = {}, transaction = null) {
    if (transaction) query.transaction = transaction
    return await this.table().findAll(query)
  }

  // Get Latest OAUTH for a user
  async getOne(filter = null, transaction = null) {
    const query = {}

    if (filter) query.where = filter

    if (transaction) query.transaction = transaction

    return await this.table().findOne(query)
  }

  // Create new
  async createUserOAuth(userOAuthData, transaction = null) {
    if (transaction) {
      return await this.table().create(userOAuthData, {
        transaction: transaction,
      })
    } else {
      return await this.table().create(userOAuthData)
    }
  }

  // update userOAuthData using id and values
  async updateUserOAuth(id, values, transaction = null) {
    const query = {
      where: {
        id,
      },
    }

    if (transaction) query.transaction = transaction

    return await this.table().update({ ...values }, query)
  }
}

module.exports = new OAuthCredentialsQueries()
