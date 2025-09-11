import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import type { ReactNode } from "react"; 

function Private({ children }: { children: ReactNode }) { // 👈 usa ReactNode
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function Home(){ return <h1 style={{textAlign:"center", marginTop:40}}>Inicio</h1>; }

export default function App(){
  const { token, user, logout } = useAuth();
  return (
    <>
      <nav style={{display:"flex", gap:12, padding:8, borderBottom:"1px solid #ddd"}}>
        <Link to="/">Inicio</Link>
        {token && <Link to="/expedientes">Expedientes</Link>}
        {user?.rol === "coordinador" && <Link to="/revisar">Revisar</Link>}
        {!token ? <Link to="/login">Login</Link> : <button onClick={logout}>Salir</button>}
      </nav>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        {/* placeholder de páginas protegidas (las crearemos después) */}
        <Route path="/expedientes" element={<Private><div style={{padding:16}}>Listado de expedientes</div></Private>} />
        <Route path="/revisar" element={<Private><div style={{padding:16}}>Revisar expedientes</div></Private>} />
      </Routes>
    </>
  );
}
