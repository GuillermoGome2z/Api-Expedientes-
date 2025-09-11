import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { token, user } = await loginApi(username, password);
      login(token, user);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || e.message || "Credenciales inválidas");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: "40px auto", display: "grid", gap: 8 }}>
      <h1>Iniciar sesión</h1>
      {err && <p role="alert">{err}</p>}
      <label>Usuario
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>Contraseña
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Entrar</button>
    </form>
  );
}
