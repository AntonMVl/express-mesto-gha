const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { httpRegex, emailRegex } = require('../utils/regex');
const { createUser } = require('../controllers/users');

router.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(httpRegex),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required().min(3),
  }),
}), createUser);

module.exports = router;
