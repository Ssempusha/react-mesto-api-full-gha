import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace, renderLoading }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  function handlePlaceName(e) {
    setName(e.target.value);
  }

  function handleLinkImage(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name,
      link,
    });
  }

  //сброс текста при открытии
  React.useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Новое место"
      name="addin-card"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      renderLoading={renderLoading}
    >
      <input
        id="place-input"
        required=""
        minLength="2"
        maxLength="30"
        className="popup__input popup__input_type_place"
        type="text"
        placeholder="Название"
        name="name"
        value={name || ""}
        onChange={handlePlaceName}
      />
      <span id="place-input-error" className="popup__error-input" />

      <input
        id="link-input"
        required=""
        className="popup__input popup__input_type_link"
        type="url"
        placeholder="Ссылка на картинку"
        name="link"
        value={link || ""}
        onChange={handleLinkImage}
      />
      <span id="link-input-error" className="popup__error-input" />
    </PopupWithForm>
  );
}

export default AddPlacePopup;
