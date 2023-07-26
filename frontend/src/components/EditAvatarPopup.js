import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, renderLoading }) {
  const avatarRef = React.useRef();
  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      /* Значение инпута, полученное с помощью рефа */
      avatar: avatarRef.current.value,
    });
  }

  //сброс текста при открытии
  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm 
      title="Обновить аватар"
      name="edit-avatar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      renderLoading={renderLoading}
    >
      <input
        id="avatar-input"
        required=""
        className="popup__input popup__input_type_link-avatar"
        type="url"
        placeholder="Ссылка на картинку"
        defaultValue=""
        name="avatar"
        ref={avatarRef}
      />
      <span id="avatar-input-error" className="popup__error-input" />
    </PopupWithForm>
  )
}

export default EditAvatarPopup;