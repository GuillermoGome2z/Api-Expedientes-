import { useEffect, useState } from "react";
import { api } from "./api/client";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/health").then(res => setMsg(res.data.ok ? "Backend conectado ✅" : "Error"));
  }, []);

  return (
    <div>
      <h1>{msg}</h1>
    </div>
  );
}

export default App;
