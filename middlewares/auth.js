const jwt = require('jsonwebtoken')
const { HTTP_STATUS_UNAUTHORIZED } = require('http2').constants

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' })
  }

  const token = authorization.replace('Bearer ', '')
  let payload
  try {
    payload = jwt.verify(token, 'secret-key')
  } catch (err) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' })
  }

  req.user = payload

  next()
}
