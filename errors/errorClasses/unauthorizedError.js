const { StatusCodes } = require('http-status-codes')

const baseError = require('./baseError')

class UnauthorizedError extends baseError {
  constructor (message, details = null) {
    super(message, details)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports = UnauthorizedError
