import React from "react";
import { Link } from "react-router-dom";

function Register({ onRegister, renderLoading }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(email, password);
  }

  return (
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          id="register-email"
          required=""
          className="auth__input"
          type="email"
          placeholder="Email"
          defaultValue=""
          name="email"
          onChange={handleEmail}
        />

        <input
          id="register-password"
          required=""
          className="auth__input"
          type="password"
          placeholder="Пароль"
          defaultValue=""
          name="password"
          onChange={handlePassword}
        />

        <button type="submit" className="auth__button">
          {renderLoading}
        </button>
      </form>
      <p className="auth__question">
        Уже зарегистрированы?{" "}
        <Link to="/sign-in" className="auth__login-link">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Register;