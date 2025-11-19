import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // ← FIX
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.css";


const API_URL = "http://localhost:5050/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;
      login(user, token);
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome to <span>EventSpace</span></h2>
        <p>Please login or register</p>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>

        <div className="auth-link">
          Don’t have an account? <Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  );
}
