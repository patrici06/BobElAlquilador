import React, { useState, useEffect } from 'react';
import styles from './BandejaDeEntrada.module.css';
import { obtenerConsultasPendientes, enviarRespuestaConsulta } from '../services/conversacionService';

// Utilidad para mostrar solo hora y minutos
function formatearHora(horaStr) {
    if (!horaStr) return '';
    return horaStr.split(":").slice(0,2).join(":");
}

function BandejaDeEntrada() {
    const [consultasPendientes, setConsultasPendientes] = useState([]);
    const [consultasRespondidas, setConsultasRespondidas] = useState([]);
    const [error, setError] = useState("");
    const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
    const [respuesta, setRespuesta] = useState("");
    const [exito, setExito] = useState("");
    const [pestañaActiva, setPestañaActiva] = useState('pendientes');

    // Cargar consultas reales del backend
    const cargarConsultas = async () => {
        try {
            setError("");
            const res = await obtenerConsultasPendientes();
            const pendientes = [];
            const respondidas = [];

            // Separar en pendientes y respondidas
            res.data.forEach(iteracion => {
                if (!iteracion.respuesta || !iteracion.respuesta.cuerpo) {
                    pendientes.push(iteracion);
                } else {
                    respondidas.push(iteracion);
                }
            });

            setConsultasPendientes(pendientes);
            setConsultasRespondidas(respondidas);
        } catch (err) {
            setError("Error al cargar las consultas");
        }
    };

    useEffect(() => {
        // Carga inicial
        cargarConsultas();

        // Configurar actualización periódica cada 30 segundos
        const intervalo = setInterval(() => {
            cargarConsultas();
        }, 30000); // 30000 ms = 30 segundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalo);
    }, []); // Array de dependencias vacío para que solo se ejecute al montar el componente

    const handleResponder = (consulta) => {
        setConsultaSeleccionada(consulta);
        setRespuesta("");
        setError("");
    };

    const enviarRespuesta = async () => {
        if (!respuesta.trim()) {
            setError("La respuesta no puede estar vacía");
            return;
        }
        try {
            await enviarRespuestaConsulta(
                consultaSeleccionada.pregunta.idP,
                respuesta
            );
            setExito("Respuesta enviada con éxito");
            setConsultaSeleccionada(null);
            setRespuesta("");
            cargarConsultas();
            setTimeout(() => setExito(""), 3000);
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al enviar la respuesta");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bandeja de Entrada</h1>

            {exito && <div className={styles.success}>{exito}</div>}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${pestañaActiva === 'pendientes' ? styles.active : ''}`}
                    onClick={() => setPestañaActiva('pendientes')}
                >
                    Pendientes <span className={styles.tabCount}>({consultasPendientes.length})</span>
                </button>
                <button
                    className={`${styles.tabButton} ${pestañaActiva === 'respondidas' ? styles.active : ''}`}
                    onClick={() => setPestañaActiva('respondidas')}
                >
                    Respondidas <span className={styles.tabCount}>({consultasRespondidas.length})</span>
                </button>
            </div>

            <div className={styles.consultasList}>
                {pestañaActiva === 'pendientes' ? (
                    consultasPendientes.length === 0 ? (
                        <div className={styles.empty}>
                            No hay consultas pendientes por responder.
                        </div>
                    ) : (
                        consultasPendientes.map((consulta, index) => (
                            <div key={index} className={styles.consultaCard}>
                                <div className={styles.consultaInfo}>
                                    <div className={styles.clienteInfo}>
                                        <span className={styles.infoLabel}>Cliente:</span>
                                        <span>{consulta.pregunta.cliente?.nombre} {consulta.pregunta.cliente?.apellido}</span>
                                    </div>
                                    <div className={styles.fecha}>
                                        {consulta.pregunta.fecha} {formatearHora(consulta.pregunta.hora)}
                                    </div>
                                </div>
                                <div className={styles.preguntaBox}>
                                    <span className={styles.infoLabel}>Pregunta:</span>
                                    <span>{consulta.pregunta.cuerpo}</span>
                                </div>
                                <button
                                    onClick={() => handleResponder(consulta)}
                                    className={styles.responderBtn}
                                    aria-label="Responder a la consulta"
                                >
                                    Responder
                                </button>
                            </div>
                        ))
                    )
                ) : (
                    consultasRespondidas.length === 0 ? (
                        <div className={styles.empty}>
                            No hay consultas respondidas.
                        </div>
                    ) : (
                        consultasRespondidas.map((consulta, index) => {
                            // Permitir compatibilidad con respuesta.empleado o respuesta.persona
                            const empleado = consulta.respuesta.empleado || consulta.respuesta.persona || {};
                            return (
                                <div key={index} className={styles.consultaCard}>
                                    <div className={styles.consultaInfo}>
                                        <div className={styles.clienteInfo}>
                                            <span className={styles.infoLabel}>Cliente:</span>
                                            <span>{consulta.pregunta.cliente?.nombre} {consulta.pregunta.cliente?.apellido}</span>
                                        </div>
                                        <div className={styles.fecha}>
                                            {consulta.pregunta.fecha} {formatearHora(consulta.pregunta.hora)}
                                        </div>
                                    </div>
                                    <div className={styles.preguntaRespuesta}>
                                        <div className={styles.preguntaContainer}>
                                            <h3>Pregunta</h3>
                                            <p className={styles.pregunta}>{consulta.pregunta.cuerpo}</p>
                                        </div>
                                        <div className={styles.respuestaContainer}>
                                            <h3>Respuesta</h3>
                                            <p className={styles.respuesta}>{consulta.respuesta.cuerpo}</p>
                                            <small className={styles.fecha}>
                                                Respondida el {consulta.respuesta.fecha} a las {formatearHora(consulta.respuesta.hora)}
                                            </small>
                                            <div className={styles.empleadoInfo}>
                                                <strong>Empleado que respondió:</strong>{" "}
                                                {empleado?.nombre || <em>No disponible</em>}{" "}
                                                {empleado?.apellido || ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                )}
            </div>

            {consultaSeleccionada && (
                <div className={styles.respuestaModal} role="dialog" aria-modal="true">
                    <div className={styles.modalContent}>
                        <h2>Responder Consulta</h2>
                        <div className={styles.preguntaOriginal}>
                            <strong>Pregunta:</strong>
                            <p>{consultaSeleccionada.pregunta.cuerpo}</p>
                        </div>
                        <textarea
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                            placeholder="Escribe tu respuesta aquí..."
                            className={styles.respuestaTextarea}
                            aria-label="Escribe tu respuesta aquí"
                        />
                        <div className={styles.modalButtons}>
                            <button
                                onClick={() => setConsultaSeleccionada(null)}
                                className={styles.cancelarBtn}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={enviarRespuesta}
                                className={styles.enviarBtn}
                                disabled={!respuesta.trim()}
                            >
                                Enviar Respuesta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BandejaDeEntrada;