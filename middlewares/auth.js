const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { handleRequestErrors } = require('../errors/handleRequestErrors')

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(StatusCodes.CREATED).send({ message: 'Необходима авторизация' })
  }

  const token = authorization.replace('Bearer ', '')
  let payload
  try {
    payload = jwt.verify(token, 'secret-key')
  } catch (err) {
    handleRequestErrors(err, next, { invalidRequestMessage: 'Не удалось создать пользователя.', conflictMessage: 'Пользователь с таким email уже зарегистрирован' })
  }

  req.user = payload

  next()
}
