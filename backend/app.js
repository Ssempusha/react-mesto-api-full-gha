// экспортируем express для создания сервера
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // испорт логгеров
const errorHandler = require('./middlewares/errors');
const NotFoundError = require('./errors/not-found-err');
// создаём приложение
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { family: 4 });
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { regexUrl } = require('./utils/constants');
const { limiter } = require('./utils/limiter');

app.use(cors({
  origin: ['http://localhost:3001', 'http://sempusha.nomoreparties.co', 'http://api.sempusha.nomoreparties.co'],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  maxAge: 30,
}));

// приложение прочитает тело запроса и выведет в формате json
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// подключаем rate-limiter
app.use(limiter);
app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use(auth); // нужно размещать над теми запросами, где нужна проверка на токен
// при обращении на /users используется usersRouter
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
// при обращении на любые другие роуты произойдёт ошибка
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
// мидлвара которая обрабатывает ошибки. нужно подключать в конце файла
app.use(errorHandler);

// обращение к 3000 порту
app.listen(3000, () => {
  console.log('Сервер запущен');
});
