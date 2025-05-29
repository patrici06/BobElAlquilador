import React, { useState, useEffect } from "react";
import styles from "./BandejaDeEntrada.module.css"; // Reutilizamos el CSS del empleado

function BandejaDeRespuestas() {
    const [respuestas, setRespuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Simular obtener el email del cliente logueado (desde token)
        const token = sessionStorage.getItem("token");
        const emailClienteLogueado = token ? JSON.parse(atob(token)).email : "cliente1@demo.com";

        // Datos simulados
        const todasLasRespuestas = [
            {
                id: 1,
                cliente: { email: "cliente1@demo.com" },
                cuerpo: "Debes registrarte y buscar la máquina.",
            },
            {
                id: 2,
                cliente: { email: "cliente2@demo.com" },
                cuerpo: "En tu cuenta podés ver más detalles.",
            },
        ];

        // Filtrar
        const filtradas = todasLasRespuestas.filter(r => r.cliente.email === emailClienteLogueado);

        // Simular carga
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
                            <p><strong>Respuesta:</strong> {r.cuerpo}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BandejaDeRespuestas;
