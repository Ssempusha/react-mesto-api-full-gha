import React from "react";

function ImagePopup({ isOpen, card, onClose }) {
  return (
    card && (
      <div className={`popup popup_open-image ${isOpen && "popup_opened"}`}>
        <div className="popup__open-image-container">
          <button type="button" className="popup__cross" onClick={onClose} />
          <figure className="popup__figure">
            <img className="popup__image" src={card.link} alt={card.name} />
            <figcaption className="popup__figcaption">{card.name}</figcaption>
          </figure>
        </div>
      </div>
    )
  );
}

export default ImagePopup;
