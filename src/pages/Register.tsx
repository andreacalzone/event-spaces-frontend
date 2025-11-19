import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.css";

const API_URL = "http://localhost:5050/api/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== repeat) {
      alert("Passwords must match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      const { token, user } = res.data;

      login(user, token);  
      navigate("/");
    } catch (err: any) {
      console.error("Register error:", err);
      alert(err?.response?.data?.msg || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>
          Welcome to <span>EventSpace</span>
        </h2>
        <p>Please register</p>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Username</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Repeat password</label>
        <input
          type="password"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          required
        />

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Submit"}
        </button>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
}
