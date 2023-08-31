const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = require('http2').constants;
const mongoose = require('mongoose');
const cardModel = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => cardModel.find({})
  .populate(['owner', 'likes'])
  .then((cards) => {
    res.status(HTTP_STATUS_OK).send(cards);
  })
  .catch(next);

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((card) => cardModel.populate(card, { path: 'owner' }))
    .then((populatedCard) => res.status(HTTP_STATUS_CREATED).send(populatedCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Карточки других пользователей удалять нельзя');
      }
      cardModel.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.addCardLike = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .orFail()
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
    } else if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
    } else {
      next(err);
    }
  });

module.exports.deleteCardLike = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .orFail()
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
    } else if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
    } else {
      next(err);
    }
  });
