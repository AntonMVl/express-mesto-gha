const router = require('express').Router()
const { getCards, createCard, deleteCard, addCardLike, deleteCardLike } = require('../controllers/cards')
const { celebrate, Joi } = require('celebrate')
const { httpRegex } = require('../utils/regex')

router.get('/cards', getCards)
router.post('/cards', celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(httpRegex)
  })
}), createCard)
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required()
  })
}), deleteCard)
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required()
  })
}), addCardLike)
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required()
  })
}), deleteCardLike)

module.exports = router
