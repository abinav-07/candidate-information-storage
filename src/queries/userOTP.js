const { UserOTP } = require("../models")

/*
 Create a class named RoleQueries which will be used to
 communicate with the database using sequelize
*/
class UserOTPQueries {
  table() {
    return UserOTP
  }

  async getAll(query = {}, transaction = null) {
    if (transaction) query.transaction = transaction
    return await this.table().findAll(query)
  }

  // Get Latest OTP for a user
  async getLatestOTP(filter = null, transaction = null) {
    const query = {
      attributes: ["id", "user_id", "otp_token", "otp_expiry_date", "otp_verified"],
      order: [["created_at", "desc"]],
    }

    if (filter) query.where = { ...query?.where, ...filter }

    if (transaction) query.transaction = transaction

    return await this.table().findOne(query)
  }

  // Create new
  async createUserOTP(userOTPData, transaction = null) {
    if (transaction) {
      return await this.table().create(userOTPData, {
        transaction: transaction,
      })
    } else {
      return await this.table().create(userOTPData)
    }
  }

  // update userOTP using id and values
  async updateUserOTP(id, values, transaction = null) {
    const query = {
      where: {
        id,
      },
    }

    if (transaction) query.transaction = transaction

    return await this.table().update({ ...values }, query)
  }
}

module.exports = new UserOTPQueries()
