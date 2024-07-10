const jwt = require("jsonwebtoken")
const Joi = require("joi")
const { sequelize } = require("../../models")

const initGoogleOAuth = require("../../services/oauth/google")
//Queries
const UsersQueries = require("../../queries/users")
const UserOAuthQueries = require("../../queries/userOAuth")
const RolesQueries = require("../../queries/roles")
const UserRolesQueries = require("../../queries/userRoles")

const { google } = require("../../config/oAuthConfig")
const { userJWTDataMapper, userDataMapper } = require("../../helpers/mappers/userMapper")
const { verifyOTPAndSendEmail } = require("../../helpers/otp")
const { ValidationException } = require("../../exceptions/httpsExceptions")
const { OAUTH_PROVIDERS, USER_ROLES } = require("../../enums")
const cookieConfig = require("../../config/cookieConfig")

// Secret
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

/**
 * @api {post} /api/oauth/google/callback OAuth Sign for Google
 * @apiName GoogleOAuthCallback
 * @apiGroup OAuth
 * @apiDescription Callback from Frontend after successful redirect from OAUTH
 *
 * @apiBody {String} token Auth token received from google
 * @apiBody {String} [role] Users role(student, mentor)
 *
 * @apiSuccess {Object} user JSON object representing the registered user data.
 * @apiSuccess {String} token JWT
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "user": UserPayload,
 *    "token": JWTToken,
 * }
 *
 * @apiError {Object} error Error object if the Oauth process fails.
 *
 */
const GoogleOAuthCallback = async (req, res, next) => {
  const data = req.body
  let t

  // Joi validations
  const schema = Joi.object({
    token: Joi.string().required(),
    role: Joi.string().valid(USER_ROLES.MENTOR, USER_ROLES.STUDENT),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // Transaction
    t = await sequelize.transaction()

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Init Google Auth
    const googleOAuthClient = await initGoogleOAuth()

    // Get user data
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: data?.token,
      audience: google.clientId,
    })
    const googlePayload = ticket?.getPayload()

    // Get Role Id
    const getRoleId = await RolesQueries.getRole({
      name: data?.role,
    })

    if (!getRoleId) throw new ValidationException(null, "Role not found!")

    // Check if user already exists
    let checkUserExists = await UsersQueries.getUser({ email: googlePayload?.email })

    // If we already have the user, just update the oauth creds and return payload
    if (checkUserExists && checkUserExists?.email) {
      //  Update Oauth creds
      const checkOAuth = await UserOAuthQueries.getOne(
        {
          user_id: checkUserExists?.id,
          provider: OAUTH_PROVIDERS.FACEBOOK,
        },
        t
      )

      // IF OAUTH exists, update creds else create
      if (checkOAuth) {
        await UserOAuthQueries.updateUserOAuth(
          checkOAuth?.id,
          {
            provider_user_id: googlePayload?.sub,
            access_token: data?.token,
            expires_at: new Date(googlePayload?.exp * 1000),
          },
          t
        )
      } else {
        await UserOAuthQueries.createUserOAuth(
          {
            user_id: checkUserExists?.id,
            provider: OAUTH_PROVIDERS.FACEBOOK,
            provider_user_id: googlePayload?.sub,
            access_token: data?.token,
            expires_at: new Date(googlePayload?.exp * 1000),
          },
          t
        )
      }

      // Send OTP
      await verifyOTPAndSendEmail(checkUserExists?.id, checkUserExists?.email, t)

      // Getting user and returning request
      const jwtPayload = userJWTDataMapper(checkUserExists)
      // Auth sign in
      const token = jwt.sign(jwtPayload, jwtSecretKey)

      // Add JWT to db
      await UsersQueries.updateUser(
        checkUserExists?.id,
        {
          jwt_token: token,
        },
        t
      )
      const responsePayload = userDataMapper(checkUserExists)

      // Commit the transaction
      await t.commit()

      // Set HTTP-only cookies for tokens
      res.cookie("token", token, cookieConfig[env])

      return res.status(200).json({
        user: responsePayload,
        token,
      })
    } else {
      // Create new user if user dsnt exist
      const createUserPayload = {
        first_name: googlePayload?.given_name,
        last_name: googlePayload?.family_name,
        email: googlePayload?.email,
      }
      // Create new user
      const registerResponse = await UsersQueries.createUser(createUserPayload, t)

      // Create User Role
      await UserRolesQueries.createUserRoles(
        {
          user_id: registerResponse?.id,
          role_id: getRoleId?.id,
        },
        t
      )

      // Create OAUTH for the user
      await UserOAuthQueries.createUserOAuth(
        {
          user_id: registerResponse?.id,
          provider: OAUTH_PROVIDERS.FACEBOOK,
          provider_user_id: googlePayload?.sub,
          access_token: data?.token,
          expires_at: new Date(googlePayload?.exp * 1000),
        },
        t
      )

      //OTP Verification
      await verifyOTPAndSendEmail(registerResponse?.id, googlePayload?.email, t)

      // Get the created User
      const user = await UsersQueries.getUser({ email: googlePayload.email }, t)
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

      // Set HTTP-only cookies for tokens
      res.cookie("token", token)

      return res.status(200).json({
        user: responsePayload,
        token,
      })
    }
  } catch (err) {
    // Rollback the transactions
    await t?.rollback()
    next(err)
  }
}

module.exports = { GoogleOAuthCallback }
