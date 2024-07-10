const { HTTP_STATUS_CODES } = require("../enums")

class HttpExceptions extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode

    //Sets Prototype if function is called using new operator
    Object.setPrototypeOf(this, new.target.prototype)
  }

  getStatusCode() {
    return this.statusCode
  }

  getMessage() {
    return this.message
  }
}

class UnauthorizedException extends HttpExceptions {
  constructor(statusCode, message) {
    super(statusCode || HTTP_STATUS_CODES.UNAUTHORIZED, message || "Authentication Error")
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

class NotFoundException extends HttpExceptions {
  constructor(statusCode, message) {
    super(statusCode || HTTP_STATUS_CODES.NOT_FOUND, message || "Not Found Error")
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

class BadRequestException extends HttpExceptions {
  constructor(statusCode, message) {
    super(statusCode || HTTP_STATUS_CODES.BAD_REQUEST, message || "Bad Request Error")
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

class ValidationException extends HttpExceptions {
  constructor(statusCode, message) {
    super(statusCode || HTTP_STATUS_CODES.VALIDATION_ERROR, message || "Bad Request Error")
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

module.exports = {
  HttpExceptions,
  ValidationException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
}
