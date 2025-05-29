import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { obtenerConversacionesPendientes } from "../services/conversacionService";
import styles from "./ConsultasPendientes.module.css";
import { jwtDecode } from "jwt-decode";

function ConsultasPendientes() {
    const [conversaciones, setConversaciones] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    useEffect(() => {
        const fetchConversaciones = async () => {
            console.log("Token en sessionStorage:", token);
            console.log("Roles:", roles);

            try {
                const res = await obtenerConversacionesPendientes();
                const data = Array.isArray(res.data) ? res.data : [res.data];
                console.log("Respuesta completa del backend:", res.data);

                setConversaciones(data);
                setError("");
            } catch (err) {
                console.error("Error al cargar conversaciones:", err);
                setError("Error al cargar las conversaciones.");
                setConversaciones([]);
            } finally {
                setLoading(false);
            }
        };

        if (roles.includes("ROLE_EMPLEADO")) {
            fetchConversaciones();
        } else {
            setError("Acceso no autorizado");
            setLoading(false);
        }
    }, [token, roles]);

    const handleClickConversacion = (idConversacion) => {
        navigate(`/conversacion/${idConversacion}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Consultas Pendientes</h1>

            {loading && <p className={styles.loading}>Cargando...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && conversaciones.length === 0 && (
                <p className={styles.empty}>No hay consultas pendientes para mostrar.</p>
            )}

            {!loading && !error && conversaciones.length > 0 && (
                <ul className={styles.list}>
                    {conversaciones.map(conv => (
                        <li
                            key={conv.id_conversacion}
                            className={styles.item}
                            onClick={() => handleClickConversacion(conv.id_conversacion)}
                        >
                            <div><strong>ID:</strong> {conv.id_conversacion}</div>
                            <div><strong>Cliente:</strong> {conv.cliente_email}</div>
                            <div><strong>Fecha:</strong> {new Date(conv.fecha_creacion).toLocaleString()}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ConsultasPendientes;
