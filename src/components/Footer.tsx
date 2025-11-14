import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <div className="logo">EventSpace</div>
        </div>

        <div className="footer-links">
          <div className="col">
            <Link to="/">Home</Link>
            <Link to="/venues">Venues</Link>
            <Link to="/about">About us</Link>
          </div>
          <div className="col">
            <Link to="/my-booking">My booking</Link>
            <Link to="/contact">Contact us</Link>
          </div>
        </div>

        <div className="footer-right">
          <div>Follow us</div>
          <div className="social-icons">
            <img alt="facebook" src="/icons/facebook.svg" />
            <img alt="instagram" src="/icons/instagram.svg" />
          </div>
        </div>
      </div>
    </footer>
  );
}
