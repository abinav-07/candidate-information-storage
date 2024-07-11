const { Candidates } = require("../models")

/*
 Create a class named CandidatesQueries which will be used to
 communicate with the database using sequelize
*/
class CandidatesQueries {
  table() {
    return Candidates
  }

  async getAll(query = {}, transaction = null) {
    if (transaction) query.transaction = transaction

    return await this.table().findAll(query)
  }

  // Get Candidate using id or any fitler
  async getOne(id, transaction = null) {
    const query = {
      where:{
        id
      }
    }

    if (transaction) query.transaction = transaction

    return await this.table().findOne(query)
  }

  // Upsert Candiate: Update if email found, Create if not found
  async upsertCandidate(candidateData, transaction = null) {
    if (transaction) {
      return await this.table().upsert(candidateData, {
        transaction: transaction,
      })
    } else {
      return await this.table().upsert(userData)
    }
  }

  // update Candidate using id and values
  async updateCandidate(id, values, transaction = null) {
    const query = {
      where: {
        id,
      },
    }

    if (transaction) query.transaction = transaction

    return await this.table().update({ ...values }, query)
  }

  // delete candidate using id
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

module.exports = new CandidatesQueries()
