const jwt = require("jsonwebtoken")

const { UnauthorizedException, HttpExceptions } = require("../exceptions/httpsExceptions")
const UserQueries = require("../queries/users")
const { USER_ROLES } = require("../enums")
const { userDataMapper } = require("../helpers/mappers/userMapper")

//Secret Key
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

// Middleware
const checkVerifiedJWTToken = async (req, res, next) => {
  try {
    // Get token from headers or cookies
    let jwtToken = req.cookies.token || req.headers.authorization

    if (jwtToken.startsWith("Bearer")) {
      jwtToken = jwtToken.split(" ")[1] //Bearer xa2132
    }

    // Decode the token from the header with the token that we signed in during login/register
    const decodedToken = jwt.verify(jwtToken, jwtSecretKey)

    const checkUser = await UserQueries.getUser({ id: decodedToken?.user_id, jwt_token: jwtToken })

    const verifiedPayloads = userDataMapper(checkUser)

    if (!checkUser) {
      throw new UnauthorizedException(null, "Unauthorized User")
    }

    req.user = verifiedPayloads
    // Call next middleware if all is good
    next()
  } catch (err) {
    // Throw err
    if (err instanceof HttpExceptions) {
      next(err)
    } else {
      next(new UnauthorizedException(null, "Invalid JWT Token"))
    }
  }
}

const checkAdmin = (req, res, next) => {
  try {
    const { user } = req
    const isAdmin = user.roles?.some((userRole) => userRole?.name === USER_ROLES.ADMIN)
    if (!isAdmin) {
      throw new UnauthorizedException(null, "Unauthorized Admin")
    }
    next()
  } catch (err) {
    // Throw err
    if (err instanceof HttpExceptions) {
      next(err)
    } else {
      next(new UnauthorizedException(null, "Invalid Admin"))
    }
  }
}

module.exports = {
  checkVerifiedJWTToken,
  checkAdmin,
}
