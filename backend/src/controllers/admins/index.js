const Joi = require("joi")
const { ValidationException } = require("../../exceptions/httpsExceptions")

//Queries
const CandidateQueries = require("../../queries/candidate")
const { sequelize } = require("../../models")
const { candidateDataMapper } = require("../../helpers/mappers/candidateMapper")
const { REGEX } = require("../../enums")

/**
 * @api {post} /api/admin/candidate/create Create Candidate Profile
 * @apiName CreateCandidateProfile
 * @apiGroup Admin
 * @apiDescription Create or update Candidate Profile
 *
 * @apiBody {String} first_name The first name of the user.
 * @apiBody {String} last_name The last name of the user.
 * @apiBody {String} email The email of the user.
 * @apiBody {String} free_text Free text comment about the user.
 * @apiBody {Number} [phone_number] Phone number of the user.
 * @apiBody {String} [linkedin_url] Linked in URL of the user.
 * @apiBody {String} [github_url] Github url of the user.
 * @apiBody {String} [availability_start_time] Start time of the availability of the user for a call.
 * @apiBody {String} [availability_end_time] End time of the availability of the user for a call.
 *
 * @apiExample {json} Request Example:
 * {
 *    "first_name": "Test",
 *    "last_name": "Me",
 *    "email": "test@mailinator.com",
 *    "free_text": "He seems good.",
 *    "phone_number": "9863211220",
 *    "linkedin_url": "http://linkedin-profile.com",
 *    "github_url": "http://github-profile.com",
 *    "availability_start_time": "09:00",
 *    "availability_end_time": "17:00",
 * }
 *
 * @apiSuccess {String} message Successfully Updated message.
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "message": "Created Successfully.",
 * }
 *
 * @apiError {Object} error Error object if the registration process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "message": error
 * }
 */
const createCandidateProfile = async (req, res, next) => {
  const data = req.body
  const admin = req.user
  let t

  // Joi validations
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    free_text: Joi.string().required(),
    // Not required values
    phone_number: Joi.number(),
    linkedin_url: Joi.string().pattern(REGEX.LINKED_URL).message("Invalid Linkendin URL."),
    github_url: Joi.string().pattern(REGEX.GITHUB_URL).message("Invalid Github URL."),
    availability_start_time: Joi.string()
      .pattern(REGEX.TIME_PATTERN)
      .message("Invalid time format, must be hh:mm"),
    availability_end_time: Joi.string()
      .pattern(REGEX.TIME_PATTERN)
      .message("Invalid time format, must be hh:mm"),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // Transaction
    t = await sequelize.transaction()

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    //  Upsert candidate info based on their email as unique key
    await CandidateQueries.upsertCandidate(
      {
        ...data,
        added_by: admin?.id,
      },
      t
    )

    // Commit the transaction
    await t.commit()

    res.status(200).json({
      message: "Created Successfully.",
    })
  } catch (err) {
    // Rollback the transactions
    await t.rollback()
    next(err)
  }
}

/**
 * @api {patch} /api/admin/candidate/:id Update Candidate Profile
 * @apiName UpdateCandidateProfile
 * @apiGroup Admin
 * @apiDescription Common API to Update Candidate's profile
 *
 * @apiBody {String} first_name The first name of the user.
 * @apiBody {String} last_name The last name of the user.
 * @apiBody {String} email The email of the user.
 * @apiBody {String} free_text Free text comment about the user.
 * @apiBody {Number} [phone_number] Phone number of the user.
 * @apiBody {String} [linkedin_url] Linked in URL of the user.
 * @apiBody {String} [github_url] Github url of the user.
 * @apiBody {String} [availability_start_time] Start time of the availability of the user for a call.
 * @apiBody {String} [availability_end_time] End time of the availability of the user for a call.
 *
 * @apiExample {json} Request Example:
 * {
 *    "first_name": "Test",
 *    "last_name": "Me",
 *    "email": "test@mailinator.com",
 *    "free_text": "He seems good.",
 *    "phone_number": "9863211220",
 *    "linkedin_url": "http://linkedin-profile.com",
 *    "github_url": "http://github-profile.com",
 *    "availability_start_time": "09:00",
 *    "availability_end_time": "17:00",
 * }
 *
 * @apiSuccess {String} message Success Message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "message": "Updated Successfully",
 * }
 *
 * @apiError {Object} error Error object if the registration process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "message": error
 * }
 */
const updateCandidateProfile = async (req, res, next) => {
  const data = req.body
  const admin = req.user
  let t

  // Joi validations
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    free_text: Joi.string().required(),
    // Not required values
    phone_number: Joi.string(),
    linkedin_url: Joi.string().pattern(REGEX.LINKED_URL).message("Invalid Linkendin URL."),
    github_url: Joi.string().pattern(REGEX.GITHUB_URL).message("Invalid Github URL."),
    availability_start_time: Joi.string()
      .pattern(REGEX.TIME_PATTERN)
      .message("Invalid time format, must be hh:mm"),
    availability_end_time: Joi.string()
      .pattern(REGEX.TIME_PATTERN)
      .message("Invalid time format, must be hh:mm"),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // Transaction
    t = await sequelize.transaction()

    const candidateId = req.params?.id

    if (!candidateId) {
      throw new ValidationException(null, "Candidate Id is required in params.")
    }

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if the candidate exists
    const candidateProfile = await CandidateQueries.getOne(candidateId, t)

    if (!candidateProfile) {
      throw new ValidationException(null, "Candidate not found, create new.")
    }

    // Update user profile
    await CandidateQueries.updateCandidate(
      candidateId,
      {
        ...data,
        added_by: admin?.id,
      },
      t
    )

    // Commit the transaction
    await t.commit()

    res.status(200).json({
      message: "Updated Successfully.",
    })
  } catch (err) {
    // Rollback the transactions
    await t.rollback()
    next(err)
  }
}

module.exports = {
  createCandidateProfile,
  updateCandidateProfile,
}
