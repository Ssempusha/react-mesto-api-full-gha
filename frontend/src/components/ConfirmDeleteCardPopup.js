import React from "react";
import PopupWithForm from "./PopupWithForm";

function ConfirmDeleteCardPopup({ isOpen, onClose, onCardDelete, renderLoading, card }) {
  function handleConfirmDeleteClick(e) {
    e.preventDefault();
    onCardDelete(card);
  }

  return (
    <PopupWithForm
      title="Вы уверены?"
      name="delete-card"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleConfirmDeleteClick}
      renderLoading={renderLoading}
    />
  );
}

export default ConfirmDeleteCardPopup;
