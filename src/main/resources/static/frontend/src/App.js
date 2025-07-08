import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SubirMaquina from "./pages/SubirMaquina";
import RegisterEmpleado from "./pages/RegisterEmpleado";
import Perfil from "./pages/Perfil";
import AlquilarMaquina from './pages/AlquilarMaquina';
import MisAlquileres from './pages/MisAlquileres';
import BandejaDeEntrada from "./pages/BandejaDeEntrada";
import ConversacionesCliente from './pages/ConversacionesCliente';
import DetalleConsulta from './pages/DetalleConsulta';
import PagoExitoso from "./pages/PagoExitoso";
import PagoFallido from "./pages/PagoFallido";
import MasAlquiladas from './pages/MasAlquiladas';
import MisEmpleados from './pages/MisEmpleados';
import EmpleadosCantidadAlquileres from "./pages/EmpleadosCantidadAlquileres";

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
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/:email" element={<Perfil />} />
                <Route path="/alquilar" element={<AlquilarMaquina />} />
                <Route path="/mis-alquileres" element={<MisAlquileres />} />
                <Route path="/consultas" element={<ConversacionesCliente />} />
                <Route path="/consultas/:conversacionId/:preguntaId" element={<DetalleConsulta />} />
                <Route path="/bandeja" element={<BandejaDeEntrada />} />
                <Route path="/pago-exitoso" element={<PagoExitoso />} />
                <Route path="/pago-fallido" element={<PagoFallido />} />
                <Route path="/mas-alquiladas" element={<MasAlquiladas />} />
                <Route path="/propietario/empleados-valoracion" element={<MisEmpleados />} />
                <Route path="/propietario/empleados-cantidad-alquileres-efectuado" element={<EmpleadosCantidadAlquileres />} />
            </Routes>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

export default App;