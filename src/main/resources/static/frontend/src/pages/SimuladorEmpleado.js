/*import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SimuladorEmpleado() {
    const navigate = useNavigate();

    useEffect(() => {
        // Simular un token con ROLE_EMPLEADO
        const fakeToken = btoa(JSON.stringify({ email: "empleado@demo.com", roles: ["ROLE_EMPLEADO"] }));
        sessionStorage.setItem("token", fakeToken);

        // Redirigir automáticamente
        navigate("/bandeja-entrada"); // Aquí la ruta a donde debe ir el empleado
    }, [navigate]);

    return <p>Simulando inicio de sesión como empleado...</p>;
}

export default SimuladorEmpleado;
*/