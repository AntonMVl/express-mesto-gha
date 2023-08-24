const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants

const errorHandler = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err
  console.error(err)
  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR // 500
        ? 'На сервере произошла ошибка'
        : message
    })
  next()
}

module.exports = errorHandler
