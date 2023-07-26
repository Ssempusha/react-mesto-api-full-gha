const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true, // поле в базе будет уникальным, если создавать такое же, то будет ошибка
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    select: false, // скрывается поле пароля из тела ответа, но в самой базе они остаются
    required: [true, 'Поле "password" должно быть заполнено'],
  },
});

// юсер схеме добавляем метод скрытия пароля в теле ответа и вызывать когда нужно скрыть пароль
userSchema.methods.toJSON = function () { // toJson - наше название метода, его мы придумываем сами
  // this - это юзер который возвращается из базы, приводим его в js объект
  const user = this.toObject();
  // ужадяем из этого объекта пароль
  delete user.password;
  // возвращаем юзера
  return user;
};

// создаём модель и экспортируем её
const User = mongoose.model('user', userSchema);

module.exports = User;
