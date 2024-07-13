const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const { ValidationException } = require("../../exceptions/httpsExceptions")

//Queries
const UsersQueries = require("../../queries/users")
const { sequelize } = require("../../models")
const { userDataMapper, userJWTDataMapper } = require("../../helpers/mappers/userMapper")
const cookieConfig = require("../../config/cookieConfig")

// Secret
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

/**
 * @api {post} /api/auth/login Login User
 * @apiName loginUser
 * @apiGroup Authentication
 * @apiDescription Log in Admin
 *
 * @apiBody {String} email Email of the Admin.
 * @apiBody {String} password Password of the Admin.
 *
 * @apiExample {json} Request Example:
 * {
 *    "email": "admin@gmail.com",
 *    "password": "admin"
 * }
 *
 * @apiSuccess {Object} user JSON object representing the logged admin data.
 * @apiSuccess {String} token Access token
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "user": UserData,
 *    "token": JWTToken
 * }
 *
 * @apiError {Object} error Error object if the login process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *    "message": error
 * }
 */
const loginUser = async (req, res, next) => {
  const data = req.body
  let t

  // Joi validation
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // Transaction
    t = await sequelize.transaction()

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if user exists
    const user = await UsersQueries.getUser({ email: data.email })

    if (!user || !user?.email) throw new ValidationException(null, "User Not Registered")

    if (user && user.password && !bcrypt.compareSync(data.password, user.password))
      throw new ValidationException(null, "Credentials did not match")

    const jwtPayload = userJWTDataMapper(user)

    // Auth sign in
    const token = jwt.sign(jwtPayload, jwtSecretKey)

    // Add JWT to db
    await UsersQueries.updateUser(
      user?.id,
      {
        jwt_token: token,
      },
      t
    )

    const responsePayload = userDataMapper(user)

    // Commit the transaction
    await t.commit()

    res.status(200).json({
      user: responsePayload,
      token,
    })
  } catch (err) {
    // Rollback the transactions
    await t.rollback()
    next(err)
  }
}

/**
 * @api {post} /api/auth/logout Logout User
 * @apiName logout
 * @apiGroup Authentication
 * @apiDescription Logout loggedin users
 *
 * @apiHeader {String} authorization Admin's unique access-key.
 *
 * @apiSuccess {String} message Logged out successfully
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "message": "Logged out successfully",
 * }
 *
 * @apiError {Object} error Error object if the logout process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *    "message": error
 * }
 */
const logout = async (req, res, next) => {
  const { user } = req

  try {
    await UsersQueries.updateUser(user?.id, {
      jwt_token: null,
    })

    res.status(200).json({
      message: "Logged out successfully",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  loginUser,
  logout,
}
