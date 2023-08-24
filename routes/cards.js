const router = require('express').Router()
const { getCards, createCard, deleteCard, addCardLike, deleteCardLike } = require('../controllers/cards')
const { celebrate, Joi } = require('celebrate')

router.get('/cards', getCards)
router.post('/cards', createCard)
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
