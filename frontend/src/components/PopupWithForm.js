import React from "react";

function PopupWithForm({ name, isOpen, onClose, title, onSubmit, renderLoading, ...props }) {
  return (
    <div className={`popup popup_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <h2 className="popup__title">{title}</h2>
        <form
          className="popup__form"
          name={`form-${name}`}
          noValidate=""
          onSubmit={onSubmit}
        >
          {props.children}
          <button type="submit" className="popup__button-save">
            {renderLoading}
          </button>
        </form>
        <button type="button" className="popup__cross" onClick={onClose} />
      </div>
    </div>
  );
}

export default PopupWithForm;