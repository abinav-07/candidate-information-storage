const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const { ValidationException } = require("../../exceptions/httpsExceptions")

//Queries
const UsersQueries = require("../../queries/users")
const RolesQueries = require("../../queries/roles")
const UserRolesQueries = require("../../queries/userRoles")
const UserOTPQueries = require("../../queries/userOTP")
const { sequelize } = require("../../models")
const { userDataMapper, userJWTDataMapper } = require("../../helpers/mappers/userMapper")
const { verifyOTPAndSendEmail } = require("../../helpers/otp")
const { USER_ROLES } = require("../../enums")
const cookieConfig = require("../../config/cookieConfig")

// Secret
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

/**
 * @api {post} /api/auth/register Register User
 * @apiName RegisterUser
 * @apiGroup Authentication
 * @apiDescription Register a user
 *
 * @apiBody {String} first_name The first name of the user.
 * @apiBody {String} last_name The last name of the user.
 * @apiBody {String} email The email of the user.
 * @apiBody {String} role The role of the user(student, mentor)
 * @apiBody {String} password The password of the user.
 * @apiBody {String} confirm_password The confirmation of the password.
 * @apiBody {String} [phone_number] Optional phone number
 * @apiBody {Date} [dob] Option Date of birth
 * @apiBody {String} [description] Optional description of the user/about me.
 * @apiBody {String} [job_title] Optional job title
 *
 * @apiBodyExample {json} Request Example:
 * {
 *    "first_name": "Test",
 *    "last_name": "Me",
 *    "email": "test@mailinator.com",
 *    "role": "mentor",
 *    "password": "Test@123",
 *    "phone_number": "9779863211220",
 *    "dob": "2000-01-21",
 *    "description": "It's me, Mario.",
 *    "job_title": "Professional Engineer",
 * }
 *
 * @apiSuccess {Object} user JSON object representing the registered user data.
 * @apiSuccess {String} Token Access token
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "user": UserPayload,
 *    "token": JWTToken,
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
const registerUser = async (req, res, next) => {
  const data = req.body
  let t

  // Joi validations
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    role: Joi.string().required().valid(USER_ROLES.MENTOR, USER_ROLES.STUDENT),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})"))
      .messages({
        "string.pattern.base": "Password must contain alphabets and numbers",
        "string.required": "Password is required",
      }),
    confirm_password: Joi.string().equal(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "string.required": "Confirm Password is required",
    }),
    // Not required values
    phone_number: Joi.string(),
    dob: Joi.date(),
    description: Joi.string(),
    job_title: Joi.string(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // Transaction
    t = await sequelize.transaction()

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    //Hash Password
    const hashedPassword = bcrypt.hashSync(data.password, 10)
    data.password = hashedPassword

    //Remove Confirmed Password from body data
    delete data.confirm_password

    let user = await UsersQueries.getUser({ email: data.email })

    if (user && user.email) throw new ValidationException(null, "User Already Registered!")

    // Get Role Id
    const getRoleId = await RolesQueries.getRole({
      name: data?.role,
    })

    if (!getRoleId) throw new ValidationException(null, "Role not found!")

    // Create new user
    const registerResponse = await UsersQueries.createUser(data, t)

    // Create User Role
    await UserRolesQueries.createUserRoles(
      {
        user_id: registerResponse?.id,
        role_id: getRoleId?.id,
      },
      t
    )
    //OTP Verification
    await verifyOTPAndSendEmail(registerResponse?.id, data?.email, t)

    // Get the created User
    user = await UsersQueries.getUser({ email: data.email }, t)

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
    res.cookie("token", token, cookieConfig[env])

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
 * @api {post} /api/auth/login Login Admin/Student/Mentors
 * @apiName loginUser
 * @apiGroup Authentication
 * @apiDescription Log in Users
 *
 * @apiBody {String} email Email of the User.
 * @apiBody {String} password Password of the User.
 *
 * @apiBodyExample {json} Request Example:
 * {
 *    "email": "test@mailinator.com",
 *    "password": "Test@123"
 * }
 *
 * @apiSuccess {Object} user JSON object representing the registered user data.
 * @apiSuccess {String} Token Access token
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "user": UserPayload,
 *    "token": JWTToken,
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

    if (!user || !user.email) throw new ValidationException(null, "User Not Registered")

    if (user && user.password && !bcrypt.compareSync(data.password, user.password))
      throw new ValidationException(null, "Credentials did not match")

    // Send OTP if not verified already
    await verifyOTPAndSendEmail(user?.id, user?.email, t)

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
    res.cookie("token", token, cookieConfig[env])

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
 * @api {patch} /api/auth/verify-otp Verify User OTP
 * @apiName verifyOTP
 * @apiGroup Authentication
 * @apiDescription Verify OTP provided to the users
 *
 * @apiBody {Number} otp 6 digits OTP for the user
 *
 * @apiBodyExample {json} Request Example:
 * {
 *    "otp": 123456,
 * }
 *
 * @apiSuccess {String} message verified user
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "message": "Successfully Verified",
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
const verifyOTP = async (req, res, next) => {
  const data = req.body
  const { user } = req
  // For transaciton
  let t

  // Joi validation
  const schema = Joi.object({
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": "OTP must be 6 digits.",
        "string.pattern.base": "OTP must be 6 digits.",
      }),
  })

  const validationResult = schema.validate(data, { abortEarly: true })

  try {
    // Transaction
    t = await sequelize.transaction()

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error?.message)

    // Check if otp is valid
    const userOtp = await UserOTPQueries.getLatestOTP({ user_id: user?.id })

    if (userOtp?.otp_token != data?.otp || userOtp?.otp_expiry_date < new Date()) {
      throw new ValidationException(null, "OTP verification failed.")
    }

    // If already verified user, send error
    if (userOtp?.otp_verified) {
      throw new ValidationException(null, "OTP already verified.")
    }

    // Set Tokens as verified
    await UserOTPQueries.updateUserOTP(
      userOtp?.id,
      {
        otp_verified: true,
      },
      t
    )

    await UsersQueries.updateUser(
      user?.id,
      {
        is_verified: true,
      },
      t
    )
    await t.commit()
    res.status(200).json({
      message: "Verified Successfully",
    })
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

/**
 * @api {get} /api/auth/resend-otp Resend User OTP
 * @apiName resendOTP
 * @apiGroup Authentication
 * @apiDescription Resend OTP to the users
 *
 * @apiSuccess {String} message Resent otp successfully
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "message": "Resent otp successfully",
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
const resendOTP = async (req, res, next) => {
  const { user } = req

  try {
    // Check if otp is valid
    const resentOTPBool = await verifyOTPAndSendEmail(user?.id, user?.email)

    // If already verified user i.e new email was not sent, send error
    if (!resentOTPBool) {
      throw new ValidationException(null, "OTP already verified.")
    }

    res.status(200).json({
      message: "Resent OTP Successfully",
    })
  } catch (err) {
    next(err)
  }
}

/**
 * @api {patch} /api/auth/me/update-profile Update User Profile
 * @apiName UpdateUserProfile
 * @apiGroup Authentication
 * @apiDescription Common API to Update currently loggedin user's profile
 *
 * @apiBody {String} first_name The first name of the user.
 * @apiBody {String} last_name The last name of the user.
 * @apiBody {String} [phone_number] Optional phone number
 * @apiBody {Date} [dob] Option Date of birth
 * @apiBody {String} [description] Optional description of the user/about me.
 * @apiBody {String} [job_title] Optional job title
 *
 * @apiBodyExample {json} Request Example:
 * {
 *    "first_name": "Test",
 *    "last_name": "Me",
 *    "phone_number": "9779863211220",
 *    "dob": "2000-01-21",
 *    "description": "It's me, Mario.",
 *    "job_title": "Professional Engineer",
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
const updateUserProfile = async (req, res, next) => {
  const data = req.body
  const user = req.user
  let t

  // Joi validations
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    // Not required values
    phone_number: Joi.string(),
    dob: Joi.date(),
    description: Joi.string(),
    job_title: Joi.string(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // Transaction
    t = await sequelize.transaction()

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Update user profile
    await UsersQueries.updateUser(
      user?.id,
      {
        ...data,
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

/**
 * @api {post} /api/auth/logout Logout User
 * @apiName logout
 * @apiGroup Authentication
 * @apiDescription Logout loggedin users
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

    // Remove Token
    res.cookie("token", "")

    res.status(200).json({
      message: "Logged out successfully",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  updateUserProfile,
  logout,
}
