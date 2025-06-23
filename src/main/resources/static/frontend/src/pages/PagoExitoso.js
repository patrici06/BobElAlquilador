import { useEffect } from "react";

function PagoExitoso() {
    useEffect(() => {
        // Redirigir al home con una query para activar lógica de React
        window.location.href = "http://localhost:3000/alquilar?pago=exitoso";
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "2em" }}>
            <h1>✅ Pago confirmado</h1>
            <p>Redirigiendo al sistema...</p>
        </div>
    );
}

export default PagoExitoso;