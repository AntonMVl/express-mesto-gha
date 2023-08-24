const { StatusCodes } = require('http-status-codes')
const { handleRequestErrors } = require('../errors/handleRequestErrors')
const NotFoundError = require('../errors/errorClasses/notFoundError')
const ForbiddenError = require('../errors/errorClasses/forbiddenError')
const cardModel = require('../models/card')
const mongoose = require('mongoose')

module.exports.getCards = (req, res, next) => {
  return cardModel.find({})
    .then((r) => {
      res.status(StatusCodes.CREATED).send(r)
    })
    .catch((err) => {
      handleRequestErrors(err, next)
    })
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body
  return cardModel.create({ name, link, owner: req.user._id })
    .then((r) => {
      return res.status(StatusCodes.CREATED).send(r)
    })
    .catch((err) => {
      handleRequestErrors(err, next, { invalidRequestMessage: 'Не удалось создать карточку' })
    })
}

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params
  return cardModel.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Карточка не найдена'))
      }

      if (card.owner.toString() !== req.user._id.toString()) {
        return Promise.reject(new ForbiddenError('Недостаточно прав для удаления карточки!'))
      }
      return res.status(StatusCodes.CREATED).send(card)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        handleRequestErrors(err, next, { badRequestMessage: 'Карточка не прошла валидацию' })
      }
      if (err instanceof mongoose.Error.CastError) {
        handleRequestErrors(err, next, { notFoundMessage: 'Карточка не найдена' })
      }
    })
}

module.exports.addCardLike = (req, res, next) => {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Карточка не найдена'))
      }
      return res.status(StatusCodes.CREATED).send(card)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        handleRequestErrors(err, next, { badRequestMessage: 'Карточка не прошла валидацию' })
      }
      if (err instanceof mongoose.Error.CastError) {
        handleRequestErrors(err, next, { notFoundMessage: 'Карточка не найдена' })
      }
    })
}

module.exports.deleteCardLike = (req, res, next) => {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Карточка не найдена'))
      }
      return res.status(StatusCodes.CREATED).send(card)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        handleRequestErrors(err, next, { badRequestMessage: 'Карточка не прошла валидацию' })
      }
      if (err instanceof mongoose.Error.CastError) {
        handleRequestErrors(err, next, { notFoundMessage: 'Карточка не найдена' })
      }
    })
}
