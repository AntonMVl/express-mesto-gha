const router = require('express').Router()
const { getUsers, getUserById, updateUserData, updateUserAvatar, getCurrentUser } = require('../controllers/users')

router.get('/users', getUsers)
router.get('/users/:userId', getUserById)
router.patch('/users/me', updateUserData)
router.patch('/users/me/avatar', updateUserAvatar)
router.get('/users/me', getCurrentUser)

module.exports = router
