const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND } = require('http2').constants
const cardModel = require('../models/card')
const mongoose = require('mongoose')

module.exports.getCards = (req, res) => {
  return cardModel.find({})
    .then((r) => {
      res.status(HTTP_STATUS_OK).send(r)
    })
    .catch((e) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body
  return cardModel.create({ name, link, owner: req.user._id })
    .then((r) => { return res.status(HTTP_STATUS_CREATED).send(r) })
    .catch((e) => {
      console.log(e)
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params
  return cardModel.findByIdAndDelete(cardId)
    .then((r) => {
      if (!r) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' })
      }
      return res.status(HTTP_STATUS_OK).send(r)
    })
    .catch((e) => {
      console.log(e)
      if (e instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Card not found' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.addCardLike = (req, res) => {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((r) => {
      if (!r) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' })
      }
      return res.status(HTTP_STATUS_OK).send(r) })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Card not found' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.deleteCardLike = (req, res) => {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((r) => {
      if (!r) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' })
      }
      return res.status(HTTP_STATUS_OK).send(r)
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Card not found' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

