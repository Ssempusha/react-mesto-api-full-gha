//export const BASE_URL = 'https://auth.nomoreparties.co';
//export const BASE_URL = 'http://localhost:3000';
export const BASE_URL = 'http://api.sempusha.nomoreparties.co';

function checkResponse(res) {
  if (res.ok) {
    //если с ответом всё ок, преобразуем его от jsonа к обычному js объекту
    return res.json();
  }
    //если же произошла ошибка, то выведется данный текст и статус
    return Promise.reject(`Произошла ошибка: ${res.status}`);
  }

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  })
  .then((res) => checkResponse(res));
}

export const authorization = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    .then((res) => checkResponse(res))
    .then((data) => {
      localStorage.setItem("userId", data._id)
      return data;
    })
  }

export const tokenCheck = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
  })
    .then((res) => checkResponse(res));
  };