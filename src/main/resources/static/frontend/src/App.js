import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SubirMaquina from "./pages/SubirMaquina";
import RegisterEmpleado from "./pages/RegisterEmpleado";
import Perfil from "./pages/Perfil";
import PerfilUsuario from "./pages/Perfil";
import AlquilarMaquina from './pages/AlquilarMaquina';
import MisAlquileres from './pages/MisAlquileres';

// ...otros imports

function App() {
    const location = useLocation();
    // Solo oculta Header/Footer en /login y /register exactamente
    const hideHeaderFooter = location.pathname === "/login" || location.pathname === "/register";

    return (
        <div>
            {!hideHeaderFooter && <Header />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/empleado" element={<RegisterEmpleado />} />
                <Route path="/" element={<Home />} />
                <Route path="/propietario/subirMaquina" element={<SubirMaquina />} />
                <Route path="/perfil/:email" element={<PerfilUsuario />} />
                <Route path="/alquilar" element={<AlquilarMaquina />} />
                <Route path="/mis-alquileres" element={<MisAlquileres />} />
                {/* Otras rutas */}
            </Routes>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

export default App;