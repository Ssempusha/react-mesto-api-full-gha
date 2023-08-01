const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs'); // подключаем модуль для хэширования
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken для создания токена
const User = require('../models/user');
const BadRequestError = require('../errors/bad-req-err'); // 400
const AuthError = require('../errors/auth-err'); // 401
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-err'); // 409

const CREATED = 201;
const OK = 200;

// req - запрос, который прислали. res - ответ
// создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  // делаем сам хэш и соль(подмешиваем какие-то свои значения в стандарный хэш)
  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(CREATED).send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else {
            next(err);
          }
        });
    });
};

// проверка логина и пароля и создание IWT
const login = (req, res, next) => {
  // вытаскиваем email и password
  const { email, password } = req.body;
  // ситуация если юзер передаёт пустые поля
  if (!email || !password) {
    throw new AuthError('Введены неправильные данные для входа');
  }
  // проверяем, существует ли пользователь с таким email
  User.findOne({ email })
    // отменяем скрытие пароля, котрое назначили в схеме
    .select('+password')
    // если не существует, то ошибка
    .orFail(() => next(new AuthError('Введены неправильные данные для входа')))
    .then((user) => {
      // проверяем, совпадает ли пароль
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // создаётся JWT
            const token = jwt.sign({
              _id: user._id,
              expiresIn: '7d', // токен будет просрочен через неделю после создания
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // секретное слово
            // JWT прикрепляется к куке
            res.cookie('token', token, { // 1 параметрт просто название, второй параметр это то что мы туда кладём
              maxAge: 3600000 * 24 * 7, // срок хранения 7 дней
              httpOnly: true, // кука доступна только в http запросах,лучше делать по умолчанию
              sameSite: 'none', // куки с яндекса не будут например уходить в гугл
              secure: true,
            });
            // если совпадает, то возвращаем юзера
            res.send(user.toJSON());
          } else {
            // если не совпадает, возвращаем ошибку
            next(new AuthError('Введены неправильные данные для входа'));
          }
        });
    })
    .catch(next);
};

// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch(next);
};

// возвращает информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// возвращает пользователя по _id
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

// обновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

// обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateAvatar,
};
