import React from "react";
import "../styles/aboutus.css";

export default function AboutUs() {
  return (
    <section className="about-wrapper">
      <h1>About Us</h1>

      <div className="about-content">
        <img
          src="/images/eventspace-team.png"
          alt="EventSpace team"
          className="team-img"
        />

        <div className="about-text">
          <h2>Who we are</h2>

          <p>
            At EventSpace, we are a small but ridiculously passionate team of
            developers, designers, and venue-enthusiasts who believe booking a
            space should be stress-free and even fun.
          </p>

          <p>
            Our mission is to give people the smoothest way possible to find,
            compare, and book venues — whether it’s for weddings, corporate
            events, parties, esports tournaments or spontaneous “we need a large
            room right now” situations.
          </p>

          <p>
            We work out of a compact office (way too compact actually). Some
            claim there are more laptops than chairs. Others say our coffee
            machine is the real CTO. But we love it — and we love building tools
            that help people create memorable events.
          </p>
        </div>
      </div>

      <div className="contact-section">
        <h2>Contact us</h2>
        <p>
          <strong>Email:</strong> hello@eventspace-app.fake
        </p>
        <p>
          <strong>Phone:</strong> +46 70 123 45 67
        </p>
        <p>
          <strong>Address:</strong> EventSpace HQ, Fikagatan 12, 113 57 Stockholm
        </p>
      </div>
    </section>
  );
}
