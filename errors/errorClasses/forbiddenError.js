const { StatusCodes } = require('http-status-codes')

const baseError = require('./baseError')

class ForbiddenError extends baseError {
  constructor (message, details = null) {
    super(message, details)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}

module.exports = ForbiddenError
