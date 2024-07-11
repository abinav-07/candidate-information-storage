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
  USER: "user",
})

const REGEX = Object.freeze({
  LINKED_URL: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
  GITHUB_URL: /^https:\/\/github\.com\/[a-zA-Z0-9-]+$/,
  TIME_PATTERN: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
})

module.exports = {
  USER_ROLES,
  HTTP_STATUS_CODES,
  REGEX,
}
