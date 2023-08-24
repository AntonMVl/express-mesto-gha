const { StatusCodes } = require('http-status-codes')

const baseError = require('./baseError')

class BadRequestError extends baseError {
  constructor (message, details = null) {
    super(message, details)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

module.exports = BadRequestError
