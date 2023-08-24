const mongoose = require('mongoose')

const NotFoundError = require('./errorClasses/notFoundError')
const ConflictError = require('./errorClasses/conflictError')
const BadRequest = require('./errorClasses/badRequest')
const UnauthorizedError = require('./errorClasses/unauthorizedError')
const ForbiddenError = require('./errorClasses/forbiddenError')
const BaseError = require('./errorClasses/baseError')

const defaults = {
  notFoundMessage: 'Объект не найден',
  badRequestMessage: 'ID объекта не валидный',
  conflictMessage: 'Такой объект уже существует',
  invalidRequestMessage: 'Переданные данные не валидны',
  unauthorizedMessage: 'Доступ запрещен',
  forbiddenMessage: 'Операция запрещена',
  defaultMessage: 'Непредвиденная ошибка сервера'
}

module.exports.handleRequestErrors = (
  error,
  next,
  config
) => {
  const messages = {
    ...defaults,
    ...config
  }
  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    next(new NotFoundError(messages.notFoundMessage, error.message))
  } else if (error.code === 11000) {
    next(new ConflictError(messages.conflictMessage, error.message))
  } else if (error instanceof mongoose.Error.CastError) {
    next(new BadRequest(messages.badRequestMessage, error.message))
  } else if (error instanceof mongoose.Error.ValidationError) {
    next(new BadRequest(messages.invalidRequestMessage, error.message))
  } else if (error instanceof UnauthorizedError) {
    next(new UnauthorizedError(messages.unauthorizedMessage, error.message))
  } else if (error instanceof ForbiddenError) {
    next(new ForbiddenError(messages.unauthorizedMessage, error.message))
  } else {
    next(new BaseError(messages.defaultMessage, error.message))
  }
}
