import React from "react";
import { Routes, Route } from "react-router-dom";

function Footer() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <footer className="footer">
            <p className="footer__copyright">© 2023 Mesto Russia</p>
          </footer>
        }
      ></Route>
    </Routes>
  );
}

export default Footer;
