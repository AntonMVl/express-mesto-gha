const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { emailRegex } = require('../utils/regex');
const { login } = require('../controllers/users');

router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required().min(3),
  }),
}), login);

module.exports = router;
