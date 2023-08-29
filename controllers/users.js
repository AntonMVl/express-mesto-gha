const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants
const BadRequestError = require('../errors/BadRequestError')
const ConflictError = require('../errors/ConflictError')
const NotFoundError = require('../errors/NotFoundError')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

module.exports.login = (req, res, next) => {
  const { email, password } = req.body
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' })
      res.send({ token })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.getUsers = (req, res, next) => {
  return userModel.find({})
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user)
    })
    .catch((err) => {
      return next(err)
    })
}

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params
  return userModel.findById(userId)
    .orFail()
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id: ${req.params.userId}`))
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по данному _id: ${req.params.userId} не найден.`))
      } else {
        next(err)
      }
    })
}

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({ name, about, avatar, email, password: hash })
      .then((user) => res.status(HTTP_STATUS_CREATED).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email
      }))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message))
        } else if (err.code === 11000) {
          next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`))
        } else {
          next(err)
        }
      }))
}

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body
  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((r) => { return res.status(HTTP_STATUS_OK).send(r) })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message))
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по данному _id: ${req.user._id} не найден.`))
      } else {
        next(err)
      }
    })
}

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail()
    .then((r) => { return res.status(HTTP_STATUS_OK).send(r) })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message))
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по данному _id: ${req.user._id} не найден.`))
      } else {
        next(err)
      }
    })
}

module.exports.getCurrentUser = (req, res, next) => {
  return userModel.findById(req.user._id)
    .orFail()
    .then((currentUser) => {
      return res.status(HTTP_STATUS_OK).send(currentUser)
    })
    .catch(next)
}
