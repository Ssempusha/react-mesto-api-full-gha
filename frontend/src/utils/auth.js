//export const BASE_URL = 'https://auth.nomoreparties.co';
export const BASE_URL = 'http://localhost:3000';

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
      credentials: 'include',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    .then((res) => checkResponse(res));
  }

export const tokenCheck = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    credentials: 'include',
    method: 'GET',
    headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${token}`},
  })
    .then((res) => checkResponse(res));
  };