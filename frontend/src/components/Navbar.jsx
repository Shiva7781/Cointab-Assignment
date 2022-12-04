import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <main>
      <div className="Navbar">
        <Link to="/register">
          <h3>Register</h3>
        </Link>
        <Link to="/login">
          <h3>Login</h3>
        </Link>
      </div>
    </main>
  );
};

export default Navbar;
