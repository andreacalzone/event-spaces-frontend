import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* LOGO */}
        <div className="footer-logo">
          <img src="/images/logo-footer.png" alt="EventSpace logo" />
        </div>

        {/* LINKS – all in one column for mobile */}
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/venues">Venues</Link>
          <Link to="/about">About us</Link>
          <Link to="/about">Contact us</Link>

          {user && (
            <Link to="/my-bookings">My bookings</Link>
          )}
        </div>

        {/* SOCIAL */}
        <div className="footer-social">
          <div className="social-icons">
            <img src="/images/footer-fb.png" alt="Facebook" />
            <img src="/images/footer-ig.png" alt="Instagram" />
          </div>
          <div className="follow-text">Follow us</div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="footer-copy">
        © 2025 EventSpace
      </div>
    </footer>
  );
}
