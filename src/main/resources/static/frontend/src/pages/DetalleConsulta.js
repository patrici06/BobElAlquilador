import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './DetalleConsulta.module.css';

function DetalleConsulta() {
    const { conversacionId, preguntaId } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`/api/conversaciones/${conversacionId}/preguntas/${preguntaId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setConsulta(response.data);
                setError('');
            })
            .catch(err => {
                console.error('Error al cargar la consulta:', err);
                setError('No se pudo cargar la consulta');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [conversacionId, preguntaId]);

    const volver = () => {
        navigate('/consultas');
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
            </div>
        </div>
    );
}

export default DetalleConsulta; 