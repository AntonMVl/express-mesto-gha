const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const UnautorizedError = require('../errors/UnauthorizedError')
const { httpRegex, emailRegex } = require('../utils/regex')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов']
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов']
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator (url) {
        return httpRegex.test(url)
      },
      message: 'Не верный URL'
    }
  },
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator (email) {
        return emailRegex.test(email)
      },
      message: 'Введите верный email'
    },
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено']
  }
}, { versionKey: false })

userSchema.statics.findUserByCredentials = function findUserByCredentials (email, password) {
  console.log(email, password)
  return this.findOne({ email }).select('+password')
    .then((user) => {
      console.log(user)
      if (!user) {
        throw new UnautorizedError('Неправильные почта или пароль')
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnautorizedError('Неправильные почта или пароль')
          }
          return user
        })
    })
}

module.exports = mongoose.model('user', userSchema)
