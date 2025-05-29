import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SimuladorCliente() {
    const navigate = useNavigate();

    useEffect(() => {
        // Simular un token con ROLE_CLIENTE
        const fakeToken = btoa(JSON.stringify({ email: "cliente@demo.com", roles: ["ROLE_CLIENTE"] }));
        sessionStorage.setItem("token", fakeToken);

        // Redirigir automáticamente
        navigate("/conversacion/nueva");
    }, [navigate]);

    return <p>Simulando inicio de sesión como cliente...</p>;
}

export default SimuladorCliente;
