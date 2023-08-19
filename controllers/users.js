const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND } = require('http2').constants
const userModel = require('../models/user')
const mongoose = require('mongoose')

module.exports.getUsers = (req, res) => {
  return userModel.find({})
    .then((r) => {
      res.status(HTTP_STATUS_OK).send(r)
    })
    .catch((e) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.getUserById = (req, res) => {
  const { userId } = req.params
  return userModel.findById(userId)
    .then((r) => {
      if (!r) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' })
      }
      return res.status(HTTP_STATUS_OK).send(r)
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body
  return userModel.create({ name, about, avatar })
    .then((r) => { return res.status(HTTP_STATUS_CREATED).send(r) })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body
  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((r) => { return res.status(HTTP_STATUS_OK).send(r) })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((r) => { return res.status(HTTP_STATUS_OK).send(r) })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' })
    })
}
