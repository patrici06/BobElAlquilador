import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversacionesCliente, getConversacionesPendientesEmpleado } from "../services/conversacionService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import styles from "./Conversaciones.module.css";

function Conversaciones() {
    const [conversaciones, setConversaciones] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const roles = getRolesFromJwt(token);
    

    // al cambiar roles o token ejecuta
    useEffect(() => { 
        const fetchConversaciones = async () => {
            try {
                if (!token || roles.length === 0) {
                    setError("No estás autenticado.");
                    setLoading(false);
                    return;
                }

                let email = "";
                const decoded = JSON.parse(atob(token.split('.')[1]));
                email = decoded.email || decoded.sub || "";

        
                let response;
                if (roles.includes("ROLE_CLIENTE")) {
                    response = await getConversacionesCliente(email);
                } else if (roles.includes("ROLE_EMPLEADO")) {
                    response = await getConversacionesPendientesEmpleado();
                } else {
                    setError("Rol no autorizado.");
                    setLoading(false);
                    return;
                }
                
                // al responder la API, se guardan datos recibidos 
                setConversaciones(response.data);
            } catch (err) {
                setError(err?.response?.data?.mensaje || "Error al cargar las conversaciones");
            } finally {
                setLoading(false);
            }
        };

        fetchConversaciones();
    }, [token, roles]);

    const handleClickConversacion = (idConversacion) => {
        navigate(`/conversacion/${idConversacion}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Conversaciones</h1>

            {loading && <p className={styles.loading}>Cargando conversaciones...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && conversaciones.length === 0 && (
                <p className={styles.empty}>No hay conversaciones para mostrar.</p>
            )}

            <ul className={styles.list}>
                {conversaciones.map(conv => (
                    <li
                        key={conv.id_conversacion}
                        className={styles.item}
                        onClick={() => handleClickConversacion(conv.id_conversacion)}
                    >
                        <div><strong>ID:</strong> {conv.id_conversacion}</div>
                        <div><strong>Cliente:</strong> {conv.cliente?.nombre} ({conv.cliente?.email})</div>
                        <div><strong>Empleado:</strong> {conv.empleado?.nombre} ({conv.empleado?.email})</div>
                        <div><strong>Fecha:</strong> {new Date(conv.fechaCreacion).toLocaleString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Conversaciones;
