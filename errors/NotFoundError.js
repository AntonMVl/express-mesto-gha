const { HTTP_STATUS_NOT_FOUND } = require('http2').constants

class NotFoundError extends Error {
  constructor (message) {
    super(message)
    this.statusCode = HTTP_STATUS_NOT_FOUND // 404
  }
}

module.exports = NotFoundError
