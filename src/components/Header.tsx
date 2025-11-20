// src/components/Header.tsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={menuOpen ? "header mobile-nav-open" : "header"}>
      <div className="header-inner">

        {/* LOGO */}
        <Link to="/" className="logo-wrap" onClick={() => setMenuOpen(false)}>
          <img src="/images/logo.svg" className="logo-image" />
        </Link>

        {/* HAMBURGER */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((p) => !p)}
        >
          ☰
        </button>

        {/* MOBILE MENU */}
        <nav className="header-nav">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/venues" onClick={() => setMenuOpen(false)}>Venues</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About us</NavLink>

          {/* Logged in extra links */}
          {user && (
            <>
              <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}>My bookings</NavLink>
              <NavLink to="/my-venues" onClick={() => setMenuOpen(false)}>My venues</NavLink>
            </>
          )}
        </nav>

        {/* RIGHT LOGIN / LOGOUT BUTTON */}
        <div className="header-right">
          {!user ? (
            <Link to="/login" className="btn-primary header-login-btn">
              Login
            </Link>
          ) : (
            <button className="btn-primary header-login-btn" onClick={logout}>
              Logout
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
