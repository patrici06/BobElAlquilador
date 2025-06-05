import React, { useEffect, useState } from "react";
import { obtenerPreguntasCliente, crearPregunta } from "../services/conversacionService";
import styles from "./ConversacionesCliente.module.css";

// Utilidad para mostrar solo hora y minutos
function formatearHora(horaStr) {
    if (!horaStr) return '';
    return horaStr.split(":").slice(0,2).join(":");
}

function ConversacionesCliente() {
    const [preguntas, setPreguntas] = useState([]);
    const [nuevaPregunta, setNuevaPregunta] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [respuestaActual, setRespuestaActual] = useState("");
    const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
    const [exitoRespuesta, setExitoRespuesta] = useState(false);
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

    const handleResponderEmpleado = (iteracion) => {
        setPreguntaSeleccionada(iteracion);
        setModalVisible(true);
    };

    const handleEnviarRespuesta = () => {
        if (!respuestaActual.trim()) return;
        
        setEnviando(true);
        // Aquí iría la lógica para enviar la respuesta al empleado
        console.log("Enviando respuesta:", respuestaActual);
        
        // Simulamos el envío exitoso
        setTimeout(() => {
            setExitoRespuesta(true);
            setEnviando(false);
            
            // Después de 2 segundos, cerramos el modal y limpiamos todo
            setTimeout(() => {
                setModalVisible(false);
                setRespuestaActual("");
                setPreguntaSeleccionada(null);
                setExitoRespuesta(false);
            }, 2000);
        }, 1000);
    };

    return (
        <div className={styles.splitContainer}>
            {/* Bloque Izquierdo: Nueva Consulta */}
            <div className={styles.leftBlock}>
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
            </div>
            {/* Bloque Derecho: Historial de Consultas */}
            <div className={styles.rightBlock}>
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
                                            {iteracion.pregunta.fecha} {formatearHora(iteracion.pregunta.hora)}
                                        </small>
                                    </div>
                                    
                                    {iteracion.respuesta && iteracion.respuesta.cuerpo && (
                                        <div className={styles.respuestaContainer}>
                                            <h3>Respuesta:</h3>
                                            <p>{iteracion.respuesta.cuerpo}</p>
                                            <small className={styles.fecha}>
                                                {iteracion.respuesta.fecha} {formatearHora(iteracion.respuesta.hora)}
                                            </small>
                                            <div className={styles.empleadoInfo}>
                                                <strong>Empleado que respondió:</strong>{" "}
                                                {iteracion.respuesta.persona?.nombre || <em>No disponible</em>}{" "}
                                                {iteracion.respuesta.persona?.apellido || ""}
                                            </div>
                                            <button
                                                onClick={() => handleResponderEmpleado(iteracion)}
                                                className={styles.responderBtn}
                                            >
                                                Responder
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Respuesta */}
            {modalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Responder al Empleado</h2>
                        <div className={styles.preguntaOriginal}>
                            <strong>Pregunta original:</strong>
                            <p>{preguntaSeleccionada?.pregunta.cuerpo}</p>
                        </div>
                        <div className={styles.respuestaEmpleado}>
                            <strong>Respuesta del empleado:</strong>
                            <p>{preguntaSeleccionada?.respuesta.cuerpo}</p>
                        </div>
                        <textarea
                            value={respuestaActual}
                            onChange={(e) => setRespuestaActual(e.target.value)}
                            placeholder="Escribe tu respuesta aquí..."
                            className={styles.respuestaTextarea}
                            disabled={enviando || exitoRespuesta}
                        />
                        {exitoRespuesta && (
                            <div className={styles.success}>
                                ¡Respuesta enviada exitosamente!
                            </div>
                        )}
                        <div className={styles.modalButtons}>
                            <button 
                                onClick={() => setModalVisible(false)} 
                                className={styles.cancelarBtn}
                                disabled={enviando || exitoRespuesta}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEnviarRespuesta}
                                disabled={enviando || exitoRespuesta || !respuestaActual.trim()}
                                className={styles.enviarBtn}
                            >
                                {enviando ? "Enviando..." : "Enviar Respuesta"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConversacionesCliente;