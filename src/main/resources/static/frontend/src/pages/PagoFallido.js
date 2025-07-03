// src/pages/PagoFallido.jsx

import { useEffect } from "react";

function PagoFallido() {
    useEffect(() => {
        // Redirigir al home con query para mostrar mensaje de error
        window.location.href = "http://localhost:3000/alquilar?pago=rechazado";
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "2em" }}>
            <h1>❌ Pago rechazado</h1>
            <p>Redirigiendo al sistema...</p>
        </div>
    );
}

export default PagoFallido;