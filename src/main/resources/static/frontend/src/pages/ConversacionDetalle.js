import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";
import { crearPregunta, obtenerPreguntasCliente } from "../services/conversacionService";
import styles from "./ConversacionDetalle.module.css";

function ConversacionDetalle() {
    const navigate = useNavigate();
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [exito, setExito] = useState("");
    const [errorMensaje, setErrorMensaje] = useState("");
    const [contador, setContador] = useState(60);
    const [enviando, setEnviando] = useState(false);
    const [preguntas, setPreguntas] = useState([]);
    const token = sessionStorage.getItem("token");

    // Extraer email desde el JWT
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            console.error("Error decodificando token:", e);
            email = "";
        }
    }

    // Cargar preguntas del usuario
    const cargarPreguntas = () => {
        obtenerPreguntasCliente()
            .then(res => {
                setPreguntas(res.data);
            })
            .catch(() => {
                setPreguntas([]);
            });
    };

    useEffect(() => {
        if (token) {
            cargarPreguntas();
        }
    }, [token]);

    const handleEnviarPregunta = async () => {
        if (!nuevoMensaje.trim()) {
            setErrorMensaje("El mensaje no puede estar vacío.");
            return;
        }

        if (!email) {
            setErrorMensaje("No se pudo obtener el email del usuario.");
            return;
        }

        setEnviando(true);
        setErrorMensaje("");

        try {
            await crearPregunta(email, nuevoMensaje.trim());
            setExito("¡Su consulta se envió correctamente! Un empleado la responderá pronto.");
            setContador(60);
            setNuevoMensaje("");
            setErrorMensaje("");
            cargarPreguntas();
        } catch (err) {
            console.error("Error al enviar pregunta:", err);
            setErrorMensaje(err.response?.data?.mensaje || "Error al enviar la consulta. Por favor, intente nuevamente.");
        } finally {
            setEnviando(false);
        }
    };

    useEffect(() => {
        if (!exito) return;

        const interval = setInterval(() => {
            setContador((prev) => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [exito]);

    useEffect(() => {
        if (contador === 0 && exito) {
            navigate("/consultas");
        }
    }, [contador, exito, navigate]);

    // Utilidad para mostrar solo hora y minutos
    function formatearHora(horaStr) {
        if (!horaStr) return '';
        return horaStr.split(":").slice(0,2).join(":");
    }

    return (
        <div className={styles.splitContainer}>
            {/* Izquierda: Nueva Consulta */}
            <div className={styles.leftBlock}>
                <h1 className={styles.title}>Nueva Consulta</h1>
                {!exito ? (
                    <div className={styles.nuevoMensaje}>
                        <textarea
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            placeholder="Escriba su consulta aquí..."
                            className={styles.textarea}
                            disabled={enviando}
                        />
                        {errorMensaje && <p className={styles.error}>{errorMensaje}</p>}
                        <button
                            onClick={handleEnviarPregunta}
                            className={styles.button}
                            disabled={enviando || !nuevoMensaje.trim()}
                        >
                            {enviando ? "Enviando..." : "Enviar Consulta"}
                        </button>
                    </div>
                ) : (
                    <div className={styles.exitoContainer}>
                        <p className={styles.exito}>{exito}</p>
                        <button
                            onClick={() => {
                                setExito("");
                                setNuevoMensaje("");
                                setContador(60);
                            }}
                            className={styles.button}
                        >
                            Realizar otra consulta
                        </button>
                        <button
                            onClick={() => navigate("/consultas")}
                            className={styles.button}
                        >
                            Ver mis consultas
                        </button>
                        <p className={styles.contador}>
                            Redirigiendo a mis consultas en {contador} segundos...
                        </p>
                    </div>
                )}
            </div>
            {/* Derecha: Consultas realizadas */}
            <div className={styles.rightBlock}>
                <h2 className={styles.titleRight}>Mis Consultas Realizadas</h2>
                <div className={styles.preguntasList}>
                    {preguntas.length === 0 ? (
                        <div className={styles.empty}>
                            No tienes consultas realizadas todavía.
                        </div>
                    ) : (
                        preguntas.map((iteracion, index) => (
                            <div key={index} className={styles.preguntaCard}>
                                <div className={styles.preguntaContainer}>
                                    <div className={styles.preguntaHeader}>
                                        <h3>Mi Pregunta:</h3>
                                        <span className={`${styles.estado} ${iteracion.respuesta && iteracion.respuesta.cuerpo ? styles.respondida : styles.pendiente}`}>
                                            {iteracion.respuesta && iteracion.respuesta.cuerpo ? "Respondida" : "Pendiente"}
                                        </span>
                                    </div>
                                    <p className={styles.preguntaText}>{iteracion.pregunta.cuerpo}</p>
                                    <small className={styles.fecha}>
                                        {iteracion.pregunta.fecha} {formatearHora(iteracion.pregunta.hora)}
                                    </small>
                                </div>
                                {iteracion.respuesta && iteracion.respuesta.cuerpo && (
                                    <div className={styles.respuestaContainer}>
                                        <h3>Respuesta:</h3>
                                        <p className={styles.respuestaText}>{iteracion.respuesta.cuerpo}</p>
                                        <small className={styles.fecha}>
                                            {iteracion.respuesta.fecha} {formatearHora(iteracion.respuesta.hora)}
                                        </small>
                                        <div className={styles.empleadoInfo}>
                                            <strong>Empleado que respondió:</strong>{" "}
                                            {iteracion.respuesta.persona?.nombre || <em>No disponible</em>}{" "}
                                            {iteracion.respuesta.persona?.apellido || ""}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConversacionDetalle;