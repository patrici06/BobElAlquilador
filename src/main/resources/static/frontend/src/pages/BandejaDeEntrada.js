import React, { useState, useEffect } from 'react';
import styles from './BandejaDeEntrada.module.css';

function BandejaDeEntrada() {
    const [consultasPendientes, setConsultasPendientes] = useState([]);
    const [consultasRespondidas, setConsultasRespondidas] = useState([]);
    const [error, setError] = useState("");
    const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
    const [respuesta, setRespuesta] = useState("");
    const [exito, setExito] = useState("");
    const [pestañaActiva, setPestañaActiva] = useState('pendientes');

    // Datos de ejemplo para simular consultas
    const consultasEjemplo = {
        pendientes: [
            {
                conversacion: { id_conversacion: 2 },
                pregunta: {
                    idP: 2,
                    cuerpo: "¿Tienen disponible alguna retroexcavadora para alquilar este fin de semana?",
                    fecha: "2024-03-05",
                    hora: "16:20",
                    cliente: {
                        nombre: "Juan",
                        apellido: "Pérez",
                        email: "juan.perez@test.com"
                    }
                }
            },
            {
                conversacion: { id_conversacion: 3 },
                pregunta: {
                    idP: 3,
                    cuerpo: "¿Cuál es el tiempo mínimo de alquiler para una excavadora?",
                    fecha: "2024-03-05",
                    hora: "17:45",
                    cliente: {
                        nombre: "María",
                        apellido: "González",
                        email: "maria.gonzalez@test.com"
                    }
                }
            }
        ],
        respondidas: [
            {
                conversacion: { id_conversacion: 1 },
                pregunta: {
                    idP: 1,
                    cuerpo: "¿Cuál es el costo del alquiler por día de la retroexcavadora?",
                    fecha: "2024-03-05",
                    hora: "14:30",
                    cliente: {
                        nombre: "Ana",
                        apellido: "Martínez",
                        email: "ana.martinez@test.com"
                    }
                },
                respuesta: {
                    cuerpo: "El costo del alquiler de la retroexcavadora es de $50.000 por día, incluyendo el combustible y el operador.",
                    fecha: "2024-03-05",
                    hora: "15:45"
                }
            }
        ]
    };

    useEffect(() => {
        // Comentamos la llamada real al backend
        // cargarConsultas();
        
        // Usamos los datos de ejemplo
        setConsultasPendientes(consultasEjemplo.pendientes);
        setConsultasRespondidas(consultasEjemplo.respondidas);
    }, []);

    const handleResponder = (consulta) => {
        setConsultaSeleccionada(consulta);
        setRespuesta("");
        setError("");
    };

    const enviarRespuesta = () => {
        if (!respuesta.trim()) {
            setError("La respuesta no puede estar vacía");
            return;
        }

        // Simulamos el envío de la respuesta
        const consultaRespondida = {
            ...consultaSeleccionada,
            respuesta: {
                cuerpo: respuesta,
                fecha: new Date().toISOString().split('T')[0],
                hora: new Date().toTimeString().split(' ')[0].substring(0, 5)
            }
        };

        // Actualizamos las listas
        setConsultasPendientes(prev => 
            prev.filter(c => c.conversacion.id_conversacion !== consultaSeleccionada.conversacion.id_conversacion)
        );
        setConsultasRespondidas(prev => [...prev, consultaRespondida]);
        
        setConsultaSeleccionada(null);
        setRespuesta("");
        setExito("Respuesta enviada con éxito");
        setTimeout(() => setExito(""), 3000);
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
                    Pendientes ({consultasPendientes.length})
                </button>
                <button 
                    className={`${styles.tabButton} ${pestañaActiva === 'respondidas' ? styles.active : ''}`}
                    onClick={() => setPestañaActiva('respondidas')}
                >
                    Respondidas ({consultasRespondidas.length})
                </button>
            </div>

            <div className={styles.consultasList}>
                {pestañaActiva === 'pendientes' ? (
                    consultasPendientes.length === 0 ? (
                        <div className={styles.empty}>
                            No hay consultas pendientes por responder
                        </div>
                    ) : (
                        consultasPendientes.map((consulta, index) => (
                            <div key={index} className={styles.consultaCard}>
                                <div className={styles.consultaInfo}>
                                    <div className={styles.clienteInfo}>
                                        <strong>Cliente:</strong> {consulta.pregunta.cliente.nombre} {consulta.pregunta.cliente.apellido}
                                    </div>
                                    <div className={styles.fecha}>
                                        {consulta.pregunta.fecha} {consulta.pregunta.hora}
                                    </div>
                                </div>
                                <p className={styles.pregunta}>{consulta.pregunta.cuerpo}</p>
                                <button
                                    onClick={() => handleResponder(consulta)}
                                    className={styles.responderBtn}
                                >
                                    Responder
                                </button>
                            </div>
                        ))
                    )
                ) : (
                    consultasRespondidas.length === 0 ? (
                        <div className={styles.empty}>
                            No hay consultas respondidas
                        </div>
                    ) : (
                        consultasRespondidas.map((consulta, index) => (
                            <div key={index} className={styles.consultaCard}>
                                <div className={styles.consultaInfo}>
                                    <div className={styles.clienteInfo}>
                                        <strong>Cliente:</strong> {consulta.pregunta.cliente.nombre} {consulta.pregunta.cliente.apellido}
                                    </div>
                                    <div className={styles.fecha}>
                                        {consulta.pregunta.fecha} {consulta.pregunta.hora}
                                    </div>
                                </div>
                                <div className={styles.preguntaRespuesta}>
                                    <div className={styles.preguntaContainer}>
                                        <h3>Pregunta:</h3>
                                        <p className={styles.pregunta}>{consulta.pregunta.cuerpo}</p>
                                    </div>
                                    <div className={styles.respuestaContainer}>
                                        <h3>Respuesta:</h3>
                                        <p className={styles.respuesta}>{consulta.respuesta.cuerpo}</p>
                                        <small className={styles.fecha}>
                                            Respondida el {consulta.respuesta.fecha} a las {consulta.respuesta.hora}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>

            {consultaSeleccionada && (
                <div className={styles.respuestaModal}>
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
