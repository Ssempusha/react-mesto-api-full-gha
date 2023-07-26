import React, { useState } from "react";

function Login({ onLogin, renderLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          id="login-email"
          required=""
          className="auth__input"
          type="email"
          placeholder="Email"
          defaultValue=""
          name="email"
          onChange={handleEmail}
        />

        <input
          id="login-password"
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
    </div>
  );
}

export default Login;
