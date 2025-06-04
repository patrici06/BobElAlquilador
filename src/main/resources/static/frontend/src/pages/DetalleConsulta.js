import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DetalleConsulta.module.css';

function DetalleConsulta() {
    const { conversacionId, preguntaId } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nuevaRespuesta, setNuevaRespuesta] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Simulamos la carga de datos con los ejemplos
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
            }
        ];

        // Simulamos una pequeña demora para mostrar el loading
        setTimeout(() => {
            const consultaEncontrada = datosEjemplo.find(
                c => c.conversacion.id_conversacion === parseInt(conversacionId) && 
                     c.pregunta.idP === parseInt(preguntaId)
            );

            if (consultaEncontrada) {
                setConsulta(consultaEncontrada);
                setError('');
            } else {
                setError('No se encontró la consulta solicitada');
            }
            setLoading(false);
        }, 500);
    }, [conversacionId, preguntaId]);

    const volver = () => {
        navigate('/consultas');
    };

    const handleEnviarRespuesta = () => {
        if (!nuevaRespuesta.trim()) {
            setError('La respuesta no puede estar vacía');
            return;
        }

        setEnviando(true);
        setError('');
        
        // Simulamos el envío de la respuesta
        setTimeout(() => {
            setMensajeExito('¡Su mensaje se envió correctamente!');
            setNuevaRespuesta('');
            setEnviando(false);
            
            // Limpiamos el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setMensajeExito('');
            }, 3000);
        }, 1000);
    };

    if (loading) return <div className={styles.loading}>Cargando...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!consulta) return <div className={styles.error}>No se encontró la consulta</div>;

    return (
        <div className={styles.container}>
            <button onClick={volver} className={styles.volverBtn}>
                ← Volver a mis consultas
            </button>

            <div className={styles.consultaCard}>
                <div className={styles.pregunta}>
                    <h2>Mi Pregunta</h2>
                    <p>{consulta.pregunta.cuerpo}</p>
                    <small className={styles.fecha}>
                        {consulta.pregunta.fecha} {consulta.pregunta.hora}
                    </small>
                </div>

                {consulta.respuesta && (
                    <div className={styles.respuesta}>
                        <h2>Respuesta del Empleado</h2>
                        <p>{consulta.respuesta.cuerpo}</p>
                        <small className={styles.fecha}>
                            {consulta.respuesta.fecha} {consulta.respuesta.hora}
                        </small>
                    </div>
                )}

                <div className={styles.formRespuesta}>
                    <h2>Tu Respuesta</h2>
                    <textarea
                        value={nuevaRespuesta}
                        onChange={(e) => setNuevaRespuesta(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        className={styles.textarea}
                        disabled={enviando}
                    />
                    {mensajeExito && (
                        <div className={styles.success}>
                            {mensajeExito}
                        </div>
                    )}
                    <div className={styles.botonesRespuesta}>
                        <button
                            onClick={handleEnviarRespuesta}
                            className={styles.enviarBtn}
                            disabled={enviando || !nuevaRespuesta.trim()}
                        >
                            {enviando ? 'Enviando...' : 'Enviar Respuesta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleConsulta; 