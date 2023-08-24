const { HTTP_STATUS_CONFLICT } = require('http2').constants

class NotFoundError extends Error {
  constructor (message) {
    super(message)
    this.statusCode = HTTP_STATUS_CONFLICT // 409
  }
}

module.exports = NotFoundError
