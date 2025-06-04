import React, { useEffect, useState } from 'react';
import { obtenerPreguntasCliente } from '../services/conversacionService';
import { jwtDecode } from "jwt-decode";
import './BandejaEntrada.css';

function BandejaEntrada() {
    const [conversaciones, setConversaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = sessionStorage.getItem("token");

    // Extraer email desde el JWT
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            console.error("Error decodificando token:", e);
        }
    }

    useEffect(() => {
        if (email) {
            setLoading(true);
            obtenerPreguntasCliente(email)
                .then(res => {
                    setConversaciones(res.data);
                    setError("");
                })
                .catch(err => {
                    console.error("Error al obtener conversaciones:", err);
                    setError("Error al cargar las conversaciones");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [email]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
            </div>
        );
    }

    return (
        <div className="bandeja-entrada">
            <h2 className="title">Mis Consultas</h2>
            {conversaciones.length === 0 ? (
                <div className="info-message">
                    No tienes consultas realizadas todavía.
                </div>
            ) : (
                <div className="conversaciones-list">
                    {conversaciones.map((conv, index) => (
                        <div key={index} className="conversacion-card">
                            <div className="pregunta-container">
                                <h3>Mi Pregunta:</h3>
                                <p>{conv.pregunta.cuerpo}</p>
                                <small className="fecha">
                                    Enviada el {conv.pregunta.fecha} a las {conv.pregunta.hora}
                                </small>
                            </div>
                            
                            {conv.respuesta ? (
                                <div className="respuesta-container">
                                    <h3>Respuesta:</h3>
                                    <p>{conv.respuesta.cuerpo}</p>
                                    <small className="fecha">
                                        Respondida el {conv.respuesta.fecha} a las {conv.respuesta.hora}
                                    </small>
                                </div>
                            ) : (
                                <div className="pending-message">
                                    Esperando respuesta...
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BandejaEntrada; 