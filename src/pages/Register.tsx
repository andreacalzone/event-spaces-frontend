import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== repeat) {
      alert("Passwords must match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      const { token, user } = res.data || {};
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      navigate("/");
    } catch (err: any) {
      console.error("Register error:", err);
      alert(err?.response?.data?.msg || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Welcome to EventSpace</h2>
        <p>please register</p>

        <label>email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>username</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>repeat password</label>
        <input type="password" value={repeat} onChange={(e) => setRepeat(e.target.value)} />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Submit"}
        </button>

        <p>already have an account? <Link to="/login">login here</Link></p>
      </form>
    </div>
  );
}
