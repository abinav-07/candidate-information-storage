const HTTP_STATUS_CODES = Object.freeze({
  OK: 200,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  VALIDATION_ERROR: 422,
})

const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  STUDENT: "student",
  MENTOR: "mentor",
})

const OAUTH_PROVIDERS = Object.freeze({
  FACEBOOK: "facebook",
})

module.exports = {
  USER_ROLES,
  HTTP_STATUS_CODES,
  OAUTH_PROVIDERS,
}
