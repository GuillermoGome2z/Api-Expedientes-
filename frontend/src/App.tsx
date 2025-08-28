import { useEffect, useState } from "react";
import { api } from "./api/client";

type HealthResponse = { ok: boolean };

export default function App() {
  const [msg, setMsg] = useState("Cargando...");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<HealthResponse>("/health");
        setMsg(data.ok ? "Backend conectado ✅" : "Backend falló");
      } catch (e) {
        setMsg("Error al conectar con la API");
        console.error(e);
      }
    })();
  }, []);

  return (
    <main style={{ display:"grid", placeItems:"center", height:"100vh", fontFamily:"system-ui" }}>
      <h1>{msg}</h1>
    </main>
  );
}
