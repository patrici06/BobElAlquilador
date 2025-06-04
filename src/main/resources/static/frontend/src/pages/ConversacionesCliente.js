import React, { useEffect, useState } from "react";
import { obtenerPreguntasCliente, crearPregunta } from "../services/conversacionService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";
import styles from "./ConversacionesCliente.module.css";

function ConversacionesCliente() {
    const [preguntas, setPreguntas] = useState([]);
    const [nuevaPregunta, setNuevaPregunta] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState(false);
    const token = sessionStorage.getItem("token");

    // Datos de ejemplo para simular consultas
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
            respuesta: null
        },
        {
            conversacion: { id_conversacion: 3 },
            pregunta: {
                idP: 3,
                cuerpo: "¿Cuál es el tiempo mínimo de alquiler para una excavadora?",
                fecha: "2024-03-06",
                hora: "09:15"
            },
            respuesta: {
                cuerpo: "El tiempo mínimo de alquiler para una excavadora es de 4 horas. Esto incluye el tiempo de transporte y configuración del equipo.",
                fecha: "2024-03-06",
                hora: "10:30"
            }
        },
        {
            conversacion: { id_conversacion: 4 },
            pregunta: {
                idP: 4,
                cuerpo: "¿Necesito algún permiso especial para operar la maquinaria?",
                fecha: "2024-03-06",
                hora: "11:45"
            },
            respuesta: null
        }
    ];

    // Extraer email desde el JWT
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            email = "";
        }
    }

    useEffect(() => {
        // Comentamos temporalmente la llamada real al backend
        // obtenerPreguntasCliente(email)
        //     .then(res => setPreguntas(res.data))
        //     .catch(err => console.error("Error al obtener preguntas:", err));
        
        // Usamos los datos de ejemplo
        setPreguntas(datosEjemplo);
    }, [email]);

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

        // Simulamos una demora en el envío
        setTimeout(() => {
            setPreguntas([...preguntas, nuevaConsulta]);
            setNuevaPregunta("");
            setError("");
            setExito(true);
            setTimeout(() => setExito(false), 3000);
            setEnviando(false);
        }, 1000);

        // Comentamos temporalmente la llamada real al backend
        // crearPregunta(email, nuevaPregunta)
        //     .then(res => {
        //         setPreguntas([...preguntas, res.data]);
        //         setNuevaPregunta("");
        //         setError("");
        //         setExito(true);
        //         setTimeout(() => setExito(false), 3000);
        //     })
        //     .catch(err => {
        //         console.error("Error al crear pregunta:", err);
        //         setError("Error al enviar la pregunta. Por favor, intenta nuevamente.");
        //     })
        //     .finally(() => {
        //         setEnviando(false);
        //     });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Consultas y respuestas</h1>
            
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
                                            {!iteracion.respuesta && (
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
                                {iteracion.respuesta && (
                                    <div className={styles.respuestaContainer}>
                                        <h3>Respuesta:</h3>
                                        <p>{iteracion.respuesta.cuerpo}</p>
                                        <small className={styles.fecha}>
                                            Respondida el {iteracion.respuesta.fecha} a las {iteracion.respuesta.hora}
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
