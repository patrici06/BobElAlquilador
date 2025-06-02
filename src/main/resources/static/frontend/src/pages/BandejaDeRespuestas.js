import React, { useState, useEffect } from "react";
import styles from "./BandejaDeEntrada.module.css";  // Reutilizamos CSS del empleado

function BandejaDeRespuestas() {
    const [respuestas, setRespuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const emailClienteLogueado = token ? JSON.parse(atob(token)).email : "cliente1@demo.com";

        // 🔥 Simulamos datos con consulta (pregunta original) y respuesta
        const todasLasRespuestas = [
            {
                id: 1,
                cliente: { email: "cliente1@demo.com" },
                consulta: "¿Cómo puedo alquilar una máquina?",  // Pregunta original
                respuesta: "Debes registrarte y buscar la máquina."
            },
            {
                id: 2,
                cliente: { email: "cliente1@demo.com" },
                consulta: "Necesito ayuda con mi alquiler.",    // Otra pregunta
                respuesta: "En tu cuenta podés ver más detalles."
            },
            {
                id: 3,
                cliente: { email: "cliente2@demo.com" },
                consulta: "¿Cuáles son los horarios de atención?",  // Otro cliente
                respuesta: "De lunes a viernes de 9 a 18."
            }
        ];

        // Filtramos solo las respuestas del cliente logueado
        const filtradas = todasLasRespuestas.filter(r => r.cliente.email === emailClienteLogueado);

        // Simulamos demora para carga (opcional)
        setTimeout(() => {
            setRespuestas(filtradas);
            setError(filtradas.length === 0 ? "No tienes respuestas por el momento." : "");
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bandeja de Respuestas</h1>

            {loading && <p className={styles.loading}>Cargando respuestas...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && respuestas.length > 0 && (
                <ul className={styles.list}>
                    {respuestas.map((r, index) => (
                        <li key={index} className={styles.item}>
                            <p><strong>ID:</strong> {r.id}</p>
                            <p><strong>Preguntaste:</strong> {r.consulta}</p>
                            <p><strong>Respuesta:</strong> {r.respuesta}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BandejaDeRespuestas;
