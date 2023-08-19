const router = require('express').Router()
const { getUsers, getUserById, createUser, updateUserData, updateUserAvatar } = require('../controllers/users')

router.get('/users', getUsers)
router.post('/users', createUser)
router.get('/users/:userId', getUserById)
router.patch('/users/me', updateUserData)
router.patch('/users/me/avatar', updateUserAvatar)

module.exports = router
