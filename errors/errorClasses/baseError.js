const { StatusCodes } = require('http-status-codes')

class baseError extends Error {
  constructor (message, details = null) {
    super(message)
    this.details = details || 'Без дополнительных сведений'
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
}

module.exports = baseError
