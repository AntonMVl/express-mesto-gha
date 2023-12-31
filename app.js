const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const singinRouter = require('./routes/singin');
const singupRouter = require('./routes/singup');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorMidleware');
const NotFoundError = require('./errors/NotFoundError');

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Монго подключена');
});
app.use(express.json());

app.use(singinRouter);
app.use(singupRouter);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Not found path!'));
});

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Запущен порт ${port}`);
});
