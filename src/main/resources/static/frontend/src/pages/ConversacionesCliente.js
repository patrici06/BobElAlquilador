import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ConversacionesCliente.module.css";

function ConversacionesCliente() {
    const navigate = useNavigate();
    const [preguntas, setPreguntas] = useState([]);
    const [nuevaPregunta, setNuevaPregunta] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        // Simulamos datos de ejemplo
        const datosEjemplo = [
            {
                conversacion: { id_conversacion: 1 },
                pregunta: {
                    idP: 1,
                    cuerpo: "¿Cuál es el costo del alquiler por día de la retroexcavadora?",
                    fecha: "2024-03-05",
                    hora: "14:30"
                },
                respuesta: {
                    cuerpo: "El costo del alquiler de la retroexcavadora es de $50.000 por día, incluyendo el combustible y el operador.",
                    fecha: "2024-03-05",
                    hora: "15:45"
                }
            },
            {
                conversacion: { id_conversacion: 2 },
                pregunta: {
                    idP: 2,
                    cuerpo: "¿Tienen disponible alguna retroexcavadora para alquilar este fin de semana?",
                    fecha: "2024-03-05",
                    hora: "16:20"
                },
                respuesta: {
                    cuerpo: "Sí, tenemos disponibilidad para este fin de semana. Puede realizar la reserva a través de nuestra plataforma seleccionando los días que necesita.",
                    fecha: "2024-03-05",
                    hora: "16:45"
                }
            },
            {
                conversacion: { id_conversacion: 3 },
                pregunta: {
                    idP: 3,
                    cuerpo: "¿Cuál es el tiempo mínimo de alquiler para una excavadora?",
                    fecha: "2024-03-05",
                    hora: "17:20"
                },
                respuesta: null
            }
        ];
        
        setPreguntas(datosEjemplo);
    }, []);

    const handleEnviarPregunta = () => {
        if (!nuevaPregunta.trim()) {
            setError("La pregunta no puede estar vacía");
            return;
        }

        setEnviando(true);
        setError("");

        // Simulamos el envío de la pregunta
        const nuevaConsulta = {
            conversacion: { id_conversacion: preguntas.length + 1 },
            pregunta: {
                idP: preguntas.length + 1,
                cuerpo: nuevaPregunta,
                fecha: new Date().toISOString().split('T')[0],
                hora: new Date().toTimeString().split(' ')[0].substring(0, 5)
            },
            respuesta: null
        };

        setTimeout(() => {
            setPreguntas([...preguntas, nuevaConsulta]);
            setNuevaPregunta("");
            setError("");
            setExito(true);
            setTimeout(() => setExito(false), 3000);
            setEnviando(false);
        }, 1000);
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
                                        <div className={styles.estadoContainer}>
                                            {iteracion.respuesta ? (
                                                <button 
                                                    onClick={() => navigate(`/consultas/${iteracion.conversacion.id_conversacion}/${iteracion.pregunta.idP}`)}
                                                    className={styles.verRespuestaBtn}
                                                >
                                                    Ver Respuesta
                                                </button>
                                            ) : (
                                                <span className={styles.pendiente}>
                                                    Pendiente
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p>{iteracion.pregunta.cuerpo}</p>
                                    <small className={styles.fecha}>
                                        {iteracion.pregunta.fecha} {iteracion.pregunta.hora}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConversacionesCliente;