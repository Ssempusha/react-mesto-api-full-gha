const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../utils/constants');
const {
  getUsers,
  getUserInfo,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
// при обращении к get '/users' и т.д выполнится createUser и т.д
router.get('/', getUsers); // возвращает всех пользователей
router.get('/me', getUserInfo); // возвращает информацию о текущем пользователе
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById); // возвращает пользователя по _id
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser); // обновляет профиль
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regexUrl),
  }),
}), updateAvatar); // обновляет аватар

module.exports = router;
