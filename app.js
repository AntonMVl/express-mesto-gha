const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRouter = require('./routes/users')
const cardRouter = require('./routes/cards')
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
}).then(() => {
  console.log('Монго подключена')
})

app.use((req, res, next) => {
  req.user = {
    _id: '64e041d80f6c82f49d5d3063'
  }

  next()
})

app.use(express.json())
app.use(userRouter)
app.use(cardRouter)

app.listen(port, () => {
  console.log(`Запущен порт ${port}`)
})
