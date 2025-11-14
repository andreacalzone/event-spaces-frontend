import React from "react";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="why-choose container">
        <h2>Why choose us?</h2>
        <div className="three-grid">
          <div className="card">
            <img src="/why1.jpg" alt="" />
            <p>Great locations</p>
          </div>
          <div className="card">
            <img src="/why2.jpg" alt="" />
            <p>Trusted hosts</p>
          </div>
          <div className="card">
            <img src="/why3.jpg" alt="" />
            <p>Easy booking</p>
          </div>
        </div>
      </section>

      <section className="container venues-list">
        <h2>Available venues</h2>
        <Link to="/venues">See all venues</Link>
      </section>
    </div>
  );
}
