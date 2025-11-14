import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Welcome to EventSpace</h2>
        <p>please login or register</p>

        <label>username (email)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>

        <p>don't have an account? <Link to="/register">register here</Link></p>
      </form>
    </div>
  );
}
