const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const UnautorizedError = require('../errors/UnauthorizedError')
const { httpRegex, emailRegex } = require('../utils/regex')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validator: {
      validator (url) {
        return httpRegex.test(url)
      },
      message: 'Не правильный URL'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator: {
      validator (email) {
        return emailRegex.test(email)
      },
      message: 'Не правильный email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false
  }
})

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
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
