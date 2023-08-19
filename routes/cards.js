const router = require('express').Router()
const { getCards, createCard, deleteCard, addCardLike, deleteCardLike } = require('../controllers/cards')

router.get('/cards', getCards)
router.post('/cards', createCard)
router.delete('/cards/:cardId', deleteCard)
router.put('/cards/:cardId/likes', addCardLike)
router.delete('/cards/:cardId/likes', deleteCardLike)

module.exports = router
