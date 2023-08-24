const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_UNAUTHORIZED } = require('http2').constants
const userModel = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports.login = (req, res) => {
  const { email, password } = req.body
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'User not found' })
      }
      const token = jwt.sign({ _id: user._id }, 'secret-key')

      res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      return res.status(HTTP_STATUS_OK).send(user)
    })
    .catch((e) => {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
    })
}

module.exports.getUsers = (req, res) => {
  return userModel.find({})
    .then((r) => {
      res.status(HTTP_STATUS_OK).send(r)
    })
    .catch((e) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
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
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
    })
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body
  bcrypt.hash(req.body.password, 10).then(hash => password === hash)
  return userModel.create({ name, about, avatar, email, password })
    .then((r) => { return res.status(HTTP_STATUS_CREATED).send(r) })
    .catch((e) => {
      console.log(e)
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
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
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
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
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
    })
}

module.exports.getCurrentUser = (req, res) => {
  const currentUser = req.user

  if (!currentUser) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'User not found' })
  }

  return res.status(HTTP_STATUS_OK).send(currentUser)
}
