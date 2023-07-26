const jwt = require('jsonwebtoken'); // импортируем модуль
const AuthError = require('../errors/auth-err');

const auth = (req, res, next) => {
  // console.log(req.cookies);
  const jwtToken = req.cookies.token; // вытаскиваем токен
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'super-mega-strong-secret');
  } catch (err) {
    next(new AuthError('Вы не авторизированы'));
  }
  req.user = payload; // во всех файлах в req будет юзер
  next();
};

module.exports = auth;
