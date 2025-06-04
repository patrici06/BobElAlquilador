import React, { useEffect, useState } from "react";
import { obtenerPreguntasCliente, crearPregunta } from "../services/conversacionService";
import styles from "./ConversacionesCliente.module.css";

function ConversacionesCliente() {
    const [preguntas, setPreguntas] = useState([]);
    const [nuevaPregunta, setNuevaPregunta] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState(false);
    const token = sessionStorage.getItem("token");

    const cargarPreguntas = () => {
        obtenerPreguntasCliente()
            .then(res => {
                setPreguntas(res.data);
                setError("");
            })
            .catch(err => {
                setError("Error al cargar las preguntas");
            });
    };

    useEffect(() => {
        if (token) {
            cargarPreguntas();
        }
    }, [token]);

    const handleEnviarPregunta = () => {
        if (!nuevaPregunta.trim()) {
            setError("La pregunta no puede estar vacía");
            return;
        }

        setEnviando(true);
        setError("");

        crearPregunta(nuevaPregunta)
            .then(() => {
                setNuevaPregunta("");
                setError("");
                setExito(true);
                cargarPreguntas();
                setTimeout(() => setExito(false), 3000);
            })
            .catch(err => {
                setError(err.response?.data?.mensaje || "Error al enviar la pregunta");
            })
            .finally(() => {
                setEnviando(false);
            });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Consultas y Respuestas</h1>

            <div className={styles.nuevaPregunta}>
                <h2>Nueva Consulta</h2>
                <textarea
                    value={nuevaPregunta}
                    onChange={(e) => setNuevaPregunta(e.target.value)}
                    placeholder="Escribe tu pregunta aquí..."
                    className={styles.textarea}
                    disabled={enviando}
                />
                {error && <div className={styles.error}>{error}</div>}
                {exito && <div className={styles.success}>¡Pregunta enviada con éxito!</div>}
                <button
                    onClick={handleEnviarPregunta}
                    disabled={enviando || !nuevaPregunta.trim()}
                    className={styles.button}
                >
                    {enviando ? "Enviando..." : "Enviar Consulta"}
                </button>
            </div>

            <div className={styles.historial}>
                <h2>Historial de Consultas</h2>
                {preguntas.length === 0 ? (
                    <div className={styles.empty}>
                        No tienes consultas realizadas todavía.
                    </div>
                ) : (
                    <div className={styles.preguntasList}>
                        {preguntas.map((iteracion, index) => (
                            <div key={index} className={styles.preguntaCard}>
                                <div className={styles.preguntaContainer}>
                                    <div className={styles.preguntaHeader}>
                                        <h3>Mi Pregunta:</h3>
                                        <span className={`${styles.estado} ${iteracion.respuesta && iteracion.respuesta.cuerpo ? styles.respondida : styles.pendiente}`}>
                                            {iteracion.respuesta && iteracion.respuesta.cuerpo ? "Respondida" : "Pendiente"}
                                        </span>
                                    </div>
                                    <p>{iteracion.pregunta.cuerpo}</p>
                                    <small className={styles.fecha}>
                                        {iteracion.pregunta.fecha} {iteracion.pregunta.hora}
                                    </small>
                                </div>
                                {iteracion.respuesta && iteracion.respuesta.cuerpo && (
                                    <div className={styles.respuestaContainer}>
                                        <h3>Respuesta:</h3>
                                        <p>{iteracion.respuesta.cuerpo}</p>
                                        <small className={styles.fecha}>
                                            {iteracion.respuesta.fecha} {iteracion.respuesta.hora}
                                        </small>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConversacionesCliente;