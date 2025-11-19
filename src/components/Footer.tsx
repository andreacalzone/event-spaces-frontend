import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* LEFT LOGO */}
        <div className="footer-logo">
          <img src="/images/logo-footer.png" alt="EventSpace logo" />
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div className="col">
            <Link to="/">Home</Link>
            <Link to="/venues">Venues</Link>
            <Link to="/about">About us</Link>
          </div>

          <div className="col">
            {user && (
              <>
                <Link to="/my-venues">My venues</Link>
                <Link to="/my-bookings">My bookings</Link>
              </>
            )}
            <Link to="/contact">Contact us</Link>
          </div>
        </div>

        {/* RIGHT SOCIAL */}
        <div className="footer-right">
          <div className="follow-text">Follow us</div>
          <div className="social-icons">
            <img src="/images/footer-fb.png" alt="Facebook" />
            <img src="/images/footer-ig.png" alt="Instagram" />
          </div>
        </div>

      </div>
    </footer>
  );
}
