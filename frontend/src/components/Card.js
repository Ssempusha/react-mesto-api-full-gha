import React from "react";
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDislike, onCardTrashClick }) {
  function handleImageClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDislikeClick() {
    onCardDislike(card);
  }

  function handleDeleteClick() {
    onCardTrashClick(card);
  }

  const currentUser = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner === currentUser._id;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(id => id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = ( 
    `cards-grid__like ${isLiked && 'cards-grid__like_active'}` 
  );

  return (
    <div className="template-card">
      <li className="cards-grid__item">
        <img className="cards-grid__image" onClick={handleImageClick} src={card.link} alt={card.name} />
        {isOwn && <button className="cards-grid__delete" type="button" onClick={handleDeleteClick} />}
        <div className="cards-grid__elements-box">
          <h2 className="cards-grid__title">{card.name}</h2>
          <div className="cards-grid__elements-like">
            <button type="button" className={cardLikeButtonClassName} onClick={ isLiked ? handleDislikeClick : handleLikeClick } />
            <p className="cards-grid__like-number">{card.likes.length}</p>
          </div>
        </div>
      </li>
    </div>
  );
}

export default Card;