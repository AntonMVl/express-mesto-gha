const router = require('express').Router()
const { getUsers, getUserById, updateUserData, updateUserAvatar, getCurrentUser, createUser } = require('../controllers/users')
const { celebrate, Joi } = require('celebrate')
const { httpRegex, emailRegex } = require('../utils/regex')

router.get('/users', getUsers)
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required()
  })
}), getUserById)
router.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(httpRegex),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required().min(3)
  })
}), createUser)
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required()
  })
}), updateUserData)
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(httpRegex).required()
  })
}), updateUserAvatar)
router.get('/users/me', getCurrentUser)

module.exports = router
