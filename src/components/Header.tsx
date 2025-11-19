import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        {/* LOGO */}
        <Link to="/" className="logo-wrap">
          <img src="/images/logo.svg" className="logo-image" />
        </Link>

        {/* NAVIGATION */}
        <nav className="header-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/venues">Venues</NavLink>
          <NavLink to="/about">About us</NavLink>

          {/* MY PAGE DROPDOWN */}
          {user && (
            <div className="dropdown" ref={menuRef}>
              <button
                className="dropdown-btn"
                onClick={() => setMenuOpen((p) => !p)}
              >
                My page ▾
              </button>

              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
                    My bookings
                  </Link>

                  <Link to="/my-venues" onClick={() => setMenuOpen(false)}>
                    My venues
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* LOGIN BUTTON */}
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
