const { StatusCodes } = require('http-status-codes')

const baseError = require('./baseError')

class NotFoundError extends baseError {
  constructor (message, details = null) {
    super(message, details)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

module.exports = NotFoundError
