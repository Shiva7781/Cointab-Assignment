import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="Navbar">
      <Link to="/">
        <h3>Home</h3>
      </Link>
      <Link to="/register">
        <h3>Register</h3>
      </Link>
      <Link to="/login">
        <h3>Login</h3>
      </Link>
    </div>
  );
};

export default Navbar;
