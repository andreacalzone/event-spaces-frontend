import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="logo">EventSpace</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/venues">Venues</Link>
          <Link to="/about">About us</Link>
          <Link to="/my-booking">My booking</Link>
        </nav>
        <div className="auth">
          <Link to="/login" className="btn-login">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
