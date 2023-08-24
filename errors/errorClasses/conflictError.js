const { StatusCodes } = require('http-status-codes')

const baseError = require('./baseError')

class ConflictError extends baseError {
  constructor (message, details = null) {
    super(message, details)
    this.statusCode = StatusCodes.CONFLICT
  }
}

module.exports = ConflictError
