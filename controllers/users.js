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
      if (!user) {
        throw new NotFoundError('Пользователь не найден')
      }
      const token = jwt.sign({ _id: user._id }, 'secret-key')

      res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      return res.status(HTTP_STATUS_OK).send(user)
    })
    .catch((err) => {
      return next(err)
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
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден')
      }
      return res.status(HTTP_STATUS_OK).send(user)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный _id: ${req.params.userId}`))
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Пользователь по данному _id: ${req.params.userId} не найден.`))
      } else {
        return next(err)
      }
    })
}

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body
  bcrypt.hash(req.body.password, 10).then(hash => password === hash)
  return userModel.create({ name, about, avatar, email, password })
    .then((r) => { return res.status(HTTP_STATUS_CREATED).send(r) })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(err.message))
      } else if (err.code === 11000) {
        return next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`))
      } else {
        return next(err)
      }
    })
}

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body
  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((r) => { return res.status(HTTP_STATUS_OK).send(r) })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(err.message))
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Пользователь по данному _id: ${req.user._id} не найден.`))
      } else {
        return next(err)
      }
    })
}

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((r) => { return res.status(HTTP_STATUS_OK).send(r) })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(err.message))
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Пользователь по данному _id: ${req.user._id} не найден.`))
      } else {
        return next(err)
      }
    })
}

module.exports.getCurrentUser = (req, res, next) => {
  const { userId } = req.user._id
  return userModel.findById(userId)
    .then((currentUser) => {
      if (!currentUser) {
        throw new NotFoundError('Пользователь не найден')
      }
      return res.status(HTTP_STATUS_OK).send(currentUser)
    })
    .catch(next)
}
