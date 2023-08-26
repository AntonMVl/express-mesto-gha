const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = require('http2').constants
const cardModel = require('../models/card')
const mongoose = require('mongoose')
const BadRequestError = require('../errors/BadRequestError')
const ForbiddenError = require('../errors/ForbiddenError')
const NotFoundError = require('../errors/NotFoundError')

module.exports.getCards = (req, res, next) => {
  return cardModel.find({})
    .then((cards) => {
      res.status(HTTP_STATUS_OK).send(cards)
    })
    .catch(next)
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body
  console.log(name, link)
  return cardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      return res.status(HTTP_STATUS_CREATED).send(card)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message))
      } else {
        next(err)
      }
    })
}

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params
  return cardModel.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена')
      }

      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Нельзя удалять карточки других пользователей')
      }
      return res.status(HTTP_STATUS_OK).send(card)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`))
      } else if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`))
      } else {
        return next(err)
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
        throw new NotFoundError('Карточка не найдена')
      }
      return res.status(HTTP_STATUS_OK).send(card)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`))
      } else if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`))
      } else {
        return next(err)
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
        throw new NotFoundError('Карточка не найдена')
      }
      return res.status(HTTP_STATUS_OK).send(card)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`))
      } else if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`))
      } else {
        return next(err)
      }
    })
}
