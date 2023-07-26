import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, renderLoading }) {
  //подписка на контекст
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  function handleSubmit(e) {
    //Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    //Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  //После загрузки текущего пользователя из API
  //его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      renderLoading={renderLoading}
    >
      <input
        id="name-input"
        required=""
        minLength="2"
        maxLength="40"
        name="name"
        className="popup__input popup__input_type_name"
        type="text"
        placeholder="Имя"
        value={name || ""}
        onChange={handleChangeName}
      />
      <span id="name-input-error" className="popup__error-input" />

      <input
        id="job-input"
        required=""
        minLength="2"
        maxLength="200"
        name="about"
        className="popup__input popup__input_type_job"
        type="text"
        placeholder="О себе"
        value={description || ""}
        onChange={handleChangeDescription}
      />
      <span id="job-input-error" className="popup__error-input" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;