import React, { useEffect, useState } from "react";
import { api } from "../utils/Api";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeleteCardPopup from "./ConfirmDeleteCardPopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isDeleteCardPopup, setDeleteCardPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState();
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [renderLoading, setrenderLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);

  const navigate = useNavigate();

  //получаем и устанавливаем информацию о пользователе с сервера
  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((userInfo) => {
          setCurrentUser(userInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  //запрос списка карточек
  useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        .then((cardsInfo) => {
          setCards(cardsInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  //лайк
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .likeCard(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //дизлайк
  function handleCardDislike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .dislikeCard(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //удаление карточки
  function handleConfirmCardDelete(card) {
    setrenderLoading(true);
    api
      .deleteCardFromServer(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setrenderLoading(false);
      });
  }

  //обработчик обновления инфы юзера
  function handleUpdateUser(data) {
    setrenderLoading(true);
    api
      .setInfoProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setrenderLoading(false);
      });
  }

  //смена аватарки
  function handleUpdateAvatar(data) {
    setrenderLoading(true);
    api
      .updateAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setrenderLoading(false);
      });
  }

  //добавление карточки
  function handleAddPlaceSubmit(data) {
    setrenderLoading(true);
    api
      .createNewCard(data)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setrenderLoading(false);
      });
  }

  //клик на кнопку редактирование профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  //клик на кнопку добавления места
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  //клик на кнопку редактирования аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  //клик на картинку карточки
  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  //клик на мусорку у карточки
  function handleDeleteCardClick(card) {
    setSelectedCard(card);
    setDeleteCardPopup(true);
  }

  function handleLoginTrueStatus() {
    setLoggedIn(true);
  }

  //закрытие попапов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setDeleteCardPopup(false);
    setIsImagePopupOpen(false);
    setInfoTooltipPopupOpen(false);
    setSelectedCard(null);
  }

  //регистрация, запрос
  const handleRegister = (email, password) => {
    setrenderLoading(true);
    auth
      .register(email, password)
      .then(() => {
        setSuccess(true);
        navigate("/sign-in");
      })
      .catch((err) => {
        setSuccess(false);
        console.log(err);
      })
      .finally(() => {
        setrenderLoading(false);
        setInfoTooltipPopupOpen(true);
      });
  };

  //аутентификация, запрос
  const handleLogin = (email, password) => {
    setrenderLoading(true);
    auth
      .authorization(email, password)
      .then((data) => {
        if (data.token) localStorage.setItem("token", data.token);
        setUserEmail(email);
        handleLoginTrueStatus();
        navigate("/");
      })
      .catch((err) => {
        setSuccess(false);
        setInfoTooltipPopupOpen(true);
        console.log(err);
      })
      .finally(() => {
        setrenderLoading(false);
      });
  };

  //проверка токена
  const tokenCheck = () => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .tokenCheck(token)
        .then((res) => {
          handleLoginTrueStatus();
          setUserEmail(res.data.email);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          navigate("/sign-in");
        });
    }
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  //удаление токена после выхода из аккаунта
  function onSignOut() {
    localStorage.removeItem("token");
    navigate("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header userEmail={userEmail} onSignOut={onSignOut} />

          <Routes>
            <Route
              path="/sign-in"
              element={
                <Login
                  onLogin={handleLogin}
                  renderLoading={renderLoading ? "Вход..." : "Войти"}
                />
              }
            />
            <Route
              path="/sign-up"
              element={
                <Register
                  onRegister={handleRegister}
                  renderLoading={
                    renderLoading ? "Регистрация..." : "Зарегистрироваться"
                  }
                />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  cards={cards}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDislike={handleCardDislike}
                  onCardTrashClick={handleDeleteCardClick}
                  loggedIn={loggedIn}
                  element={Main}
                />
              }
            />
            <Route
              path="*"
              element={<Navigate to={loggedIn ? "/" : "/sign-in"} />}
            />
          </Routes>

          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            renderLoading={renderLoading ? "Сохранение..." : "Сохранить"}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            renderLoading={renderLoading ? "Сохранение..." : "Создать"}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            renderLoading={renderLoading ? "Сохранение..." : "Сохранить"}
          />

          <ImagePopup
            isOpen={isImagePopupOpen}
            card={selectedCard}
            onClose={closeAllPopups}
          />

          <ConfirmDeleteCardPopup
            isOpen={isDeleteCardPopup}
            onClose={closeAllPopups}
            onCardDelete={handleConfirmCardDelete}
            renderLoading={renderLoading ? "Удаление..." : "Да"}
            card={selectedCard}
          />
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            success={success}
            tooltipText={
              success
                ? "Вы успешно зарегистрировались!"
                : "Что-то пошло не так! Попробуйте еще раз."
            }
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;