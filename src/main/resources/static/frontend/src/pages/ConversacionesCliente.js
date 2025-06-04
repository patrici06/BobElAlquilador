/* MAS ABAJO AGREGUE PARA PROBAR COMO SE VEIA EL FRONT. para el back descomentar esto 
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

    const cargarPreguntas = () => {
        if (email) {
            obtenerPreguntasCliente(email)
                .then(res => {
                    setPreguntas(res.data);
                    setError("");
                })
                .catch(err => {
                    console.error("Error al obtener preguntas:", err);
                    setError("Error al cargar las preguntas");
                });
        }
    };

    useEffect(() => {
        cargarPreguntas();
    }, [email]);

    const handleEnviarPregunta = () => {
        if (!nuevaPregunta.trim()) {
            setError("La pregunta no puede estar vacía");
            return;
        }

        setEnviando(true);
        setError("");

        crearPregunta(nuevaPregunta)
            .then((response) => {
                setNuevaPregunta("");
                setError("");
                setExito(true);
                cargarPreguntas();
                setTimeout(() => setExito(false), 3000);
            })
            .catch(err => {
                console.error("Error al crear pregunta:", err);
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
                                        <span className={`${styles.estado} ${iteracion.respuesta ? styles.respondida : styles.pendiente}`}>
                                            {iteracion.respuesta ? "Respondida" : "Pendiente"}
                                        </span>
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


*/ 

import React, { useEffect, useState } from "react";
import { obtenerPreguntasCliente, crearPregunta } from "../services/conversacionService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import styles from "./ConversacionesCliente.module.css";

function ConversacionesCliente() {
    const navigate = useNavigate();
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
        }
    ];

    useEffect(() => {
        // Comentamos temporalmente la llamada real al backend
        // cargarPreguntas();
        
        // Usamos los datos de ejemplo
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

        setPreguntas([...preguntas, nuevaConsulta]);
        setNuevaPregunta("");
        setError("");
        setExito(true);
        setTimeout(() => setExito(false), 3000);
        setEnviando(false);
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
