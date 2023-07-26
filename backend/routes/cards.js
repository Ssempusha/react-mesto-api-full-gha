const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../utils/constants');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
// при обращении к get '/users' и т.д выполнится createUser и т.д
router.get('/', getCards); // возвращает все карточки
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard); // удаляет карточку по идентификатору
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regexUrl),
  }),
}), createCard); // создаёт карточку
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard); // убрать лайк с карточки

module.exports = router;
