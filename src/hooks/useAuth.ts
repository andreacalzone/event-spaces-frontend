import { useEffect, useState } from "react";
import axios from "axios"; // ← FIX: använd axios direkt

export function useAuth() {
  function getUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }

  const [user, setUser] = useState<any | null>(getUser());

  useEffect(() => {
    function handleChange() {
      setUser(getUser());
    }
    window.addEventListener("auth-changed", handleChange);
    return () => window.removeEventListener("auth-changed", handleChange);
  }, []);

  function login(userObj: any, token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));

    // 🔥 FIX — sätt Authorization på axios globalt
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    window.dispatchEvent(new Event("auth-changed"));
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔥 FIX — ta bort header från axios istället för api
    delete axios.defaults.headers.common["Authorization"];

    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/";
  }

  return { user, login, logout };
}
