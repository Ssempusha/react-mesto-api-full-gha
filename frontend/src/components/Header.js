import React from "react";
import { Routes, Route, Link } from 'react-router-dom';
import headerLogo from "../images/logo/logo.svg";

function Header({ userEmail, onSignOut }) {

  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип Mesto" />
      <Routes>
        <Route path="/" element={
          <div className="header__menu">
            <a className="header__email">{userEmail}</a>
            <Link className="header__link-exit" to="/sign-in" onClick={onSignOut}>
              Выйти
            </Link>
          </div>
        }>
        </Route>

        <Route
          path="/sign-in"
          element={
            <Link className="header__link-auth" to="/sign-up">
              Регистрация
            </Link>
          }>
        </Route>
        <Route
          path="/sign-up"
          element={
            <Link className="header__link-auth" to="/sign-in">
              Войти
            </Link>
          }>
        </Route>
      </Routes>
    </header>
  )
}

export default Header;